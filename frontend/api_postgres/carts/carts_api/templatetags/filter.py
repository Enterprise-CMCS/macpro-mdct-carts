from django import template

register = template.Library()

@register.filter(name='split_last')
def split(value, key):
    """
        Returns last value of split string
    """

    # print(f"\n\n***>value is: {value} ")
    
    return value.split(key).pop()

@register.filter(name='array_value_at_index')
def list_item(the_array, i):
    try:
        
        return the_array[i]
    except:
        return None
# doesn't work properly because the incoming string doesn't have the issue just yet
@register.filter(name='replace_html_symbol')
def replace_html(the_string):
    try:
        return the_string.replace('â€™',"'")
    except:
        return None
