from django import template

register = template.Library()

@register.filter(name='split_last')
def split(value, key):
    """
        Returns last value of split string
    """

    # print(f"\n\n***>value is: {value} ")
    
    return value.split(key).pop()