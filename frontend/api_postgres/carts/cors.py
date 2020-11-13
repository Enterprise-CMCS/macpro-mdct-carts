class CorsMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_response(self, request, response):
        response["Access-Control-Allow-Origin"] = os.environ.get("ENDPOINT_UI")
        return response
