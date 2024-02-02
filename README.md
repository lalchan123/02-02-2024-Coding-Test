# mediusware-coding-test follow the instruction for the project run

## download the project and extract the project
## Enter the django-coding-test folder and open the project in vs code
## Then run these commands
```
pip install pipenv
```
```
pipenv install 
```
```
pipenv shell
```
## Rename the .env.example file to the .env file in the src folder
## enter the src folder
```
cd src
```
## migrate and migration command
```
python manage.py makemigrations
```
```
python manage.py migrate
```
## to load the demo data execute this command
```
python manage.py loaddata django_coding_test.json
```
## superuser create with this command
```
python manage.py createsuperuser
```
## then run the project with this command
```
python manage.py runserver
```

## Enter the django-coding-test folder
## Then run these commands 
```
npm install
```
```
npm run watch
```