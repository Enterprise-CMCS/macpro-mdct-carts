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

@register.filter(name='split_and_index_at')
def list_item(the_string,split_and_index):
    try:
        the_split = split_and_index.split(",")[0]
        the_index = int(split_and_index.split(",")[1])
        return the_string.split(the_split)[the_index]
    except:
        return None
# doesn't work properly because the incoming string doesn't have the issue just yet
@register.filter(name='replace_html_symbol')
def replace_html(the_string):
    try:
        return the_string.replace('â€™',"'")
    except:
        return None

@register.filter(name='build_month_year')
def build_month_year(the_string):
    try:
        tempdate = the_string.split("-")
        return tempdate[1]+'-'+tempdate[0]
    except:
        return None

@register.filter(name='calculate_percent')
def get_type_of(denominator,numerator):
    try:
        return str((float(numerator)/float(denominator))*100)[0:5]
    except:
        return None

@register.filter(name='get_type_of')
def get_type_of(obj):
    return obj.__class__.__name__