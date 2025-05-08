from . import create_app
from .views import views

app = create_app()
app.register_blueprint(views, url_prefix='/')

if __name__ == '__main__':
    app.run(debug=True)