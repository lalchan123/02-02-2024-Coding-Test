import React, { useRef, useState } from 'react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Dropzone from 'react-dropzone'

import './drop-file-input/drop-file-input.css';
import uploadImg from './drop-file-input/assets/cloud-upload-regular-240.png';

import axios from 'axios'

import FlashMessage from 'react-flash-message'

const CreateProduct = (props) => {

    const [productName, setProductName] = useState("")
    const [productSku, setProductSku] = useState("")
    const [productDescription, setProductDescription] = useState("")

    console.log("57 product", productName, productSku, productDescription);

    const [show, setShow] = useState(false)
    const [messsage, setMesssage] = useState("")


    const [productVariantPrices, setProductVariantPrices] = useState([])
    console.log("16 productVariantPrices", productVariantPrices);

    const [productVariants, setProductVariant] = useState([
        {
            option: 1,
            tags: []
        }
    ])
    console.log("24 productVariants", productVariants);



    //  image upload start
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState("");
    const [image, setImage] = useState()
    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        setFileList(newFile)
        const objectUrl = URL.createObjectURL(newFile)
        setImage(objectUrl)
    }

    const fileRemove = (file) => {
        setFileList("");
        setImage()
    }

    //  image upload end



    // handle input change on price input
    const handleInputPriceOnChange = (value, index) => {
        let product_variant_prices = [...productVariantPrices]
        product_variant_prices[index].price = parseInt(value)
        setProductVariantPrices(product_variant_prices)

    }
    // handle input change on stock input
    const handleInputStockOnChange = (value, index) => {
        let product_variant_prices = [...productVariantPrices]
        product_variant_prices[index].stock = parseInt(value)
        setProductVariantPrices(product_variant_prices)

    }

    // handle click event of the Add button
    const handleAddClick = () => {
        let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(el => el.id)
        let selected_variants = productVariants.map(el => el.option);
        let available_variants = all_variants.filter(entry1 => !selected_variants.some(entry2 => entry1 == entry2))
        setProductVariant([...productVariants, {
            option: available_variants[0],
            tags: []
        }])
    };

    // handle input change on tag input
    const handleInputTagOnChange = (value, index) => {
        let product_variants = [...productVariants]
        product_variants[index].tags = value
        setProductVariant(product_variants)

        checkVariant()
    }

    // remove product variant
    const removeProductVariant = (index) => {
        let product_variants = [...productVariants]
        product_variants.splice(index, 1)
        setProductVariant(product_variants)
    }

    // check the variant and render all the combination
    const checkVariant = () => {
        let tags = [];

        productVariants.filter((item) => {
            tags.push(item.tags)
        })

        setProductVariantPrices([])

        getCombn(tags).forEach(item => {
            setProductVariantPrices(productVariantPrice => [...productVariantPrice, {
                title: item,
                price: 0,
                stock: 0
            }])
        })

    }

    // combination algorithm
    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce(function (ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + value + '/'));
        }, []);
        return ans;
    }

    // cookie function
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');
    console.log("31 csrftoken", csrftoken);

    // Save product
    let saveProduct = (event) => {
        event.preventDefault();
        setShow(false)
        // TODO : write your code here to save the product
        const data = {
            'productName': productName,
            'productSku': productSku,
            'productDescription': productDescription,
            'file_path': image,
            'productVariant': productVariants,
            'productVariantPrice': productVariantPrices,
        }

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        };

        axios.post("http://localhost:8000/product/createproduct-api/", data, config)
            .then(response => {
                console.log("161 Product Create", response.data)
                setShow(true)
                setMesssage(response?.data?.message)
            })
            .catch(err => {
                console.log("206 error", err)
                setShow(true)
                setMesssage(err.message)
            });

    }


    return (
        <div>
            <section>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        className="form-control"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Product SKU</label>
                                    <input
                                        type="text"
                                        placeholder="Product SKU"
                                        className="form-control"
                                        value={productSku}
                                        onChange={(e) => setProductSku(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Description</label>
                                    <textarea
                                        id=""
                                        cols="30"
                                        rows="4"
                                        className="form-control"
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Media</h6>
                            </div>
                            <div className="card-body border">
                                <div
                                    ref={wrapperRef}
                                    className="drop-file-input"
                                    onDragEnter={onDragEnter}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >
                                    <div className="drop-file-input__label">
                                        <img src={uploadImg} alt="" />
                                        <p>Drag & Drop your files here</p>
                                    </div>
                                    <input type="file" value="" onChange={onFileDrop} />
                                </div>
                                {
                                    fileList ? (
                                        <div className="drop-file-preview">
                                            <p className="drop-file-preview__title">
                                                Ready to upload
                                            </p>

                                            <div className="drop-file-preview__item">
                                                <img src={image} alt="" />
                                                <div className="drop-file-preview__item__info">
                                                    <p>{fileList?.name}</p>
                                                    <p>{fileList?.size}B</p>
                                                </div>
                                                <span className="drop-file-preview__item__del" onClick={() => fileRemove(fileList)}>x</span>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div
                                className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Variants</h6>
                            </div>
                            <div className="card-body">

                                {
                                    productVariants.map((element, index) => {
                                        return (
                                            <div className="row" key={index}>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="">Option</label>
                                                        <select className="form-control" defaultValue={element.option}>
                                                            {
                                                                JSON.parse(props.variants.replaceAll("'", '"')).map((variant, index) => {
                                                                    return (<option key={index}
                                                                        value={variant.id}>{variant.title}</option>)
                                                                })
                                                            }

                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        {
                                                            productVariants.length > 1
                                                                ? <label htmlFor="" className="float-right text-primary"
                                                                    style={{ marginTop: "-30px" }}
                                                                    onClick={() => removeProductVariant(index)}>remove</label>
                                                                : ''
                                                        }

                                                        <section style={{ marginTop: "30px" }}>
                                                            <TagsInput value={element.tags}
                                                                style="margin-top:30px"
                                                                onChange={(value) => handleInputTagOnChange(value, index)} />
                                                        </section>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                            <div className="card-footer">
                                {productVariants.length !== 3
                                    ? <button className="btn btn-primary" onClick={handleAddClick}>Add another
                                        option</button>
                                    : ''
                                }

                            </div>

                            <div className="card-header text-uppercase">Preview</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <td>Variant</td>
                                                <td>Price</td>
                                                <td>Stock</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productVariantPrices.map((productVariantPrice, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{productVariantPrice.title}</td>
                                                            <td><input className="form-control" type="text" onChange={(e) => handleInputPriceOnChange(e.target.value, index)} /></td>
                                                            <td><input className="form-control" type="text" onChange={(e) => handleInputStockOnChange(e.target.value, index)} /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" onClick={saveProduct} className="btn btn-lg btn-primary">Save</button>
                <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
            </section>
            {show &&
                < div className="bg-info w-50 h-15 rounded-sm" style={{ marginTop: '20px' }}>
                    <FlashMessage duration={5000} persistOnHover={true}>
                        <strong>{messsage}</strong>
                    </FlashMessage>
                </div>
            }
        </div>
    );
};

export default CreateProduct;
