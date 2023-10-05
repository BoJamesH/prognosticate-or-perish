from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class CommentForm(FlaskForm):
    comment_text = StringField('comment_text')

# , validators=[DataRequired(), Length(min = 1, max= 4000, message=None)]
