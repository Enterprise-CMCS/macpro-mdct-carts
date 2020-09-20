from django.test import TestCase
from carts.carts_api.models import FMAP, ACS
from rest_framework.test import APIRequestFactory


class FMAPTestCase(TestCase):
    def setUp(self):
        FMAP.objects.create(state="AK", fiscal_year=2020, enhanced_FMAP=63.4)

    def test_filter_by_state(self):
        #test that  API endpoint properly  filters by state
        pass

class ACSTestCase(TestCase):
    def setUp(self):
        ACS.objects.create(state="AK",
                                   year=2019,
                                   number_uninsured=4000,
                                   number_uninsured_moe=1000,
                                   percent_uninsured=2.1,
                                   percent_uninsured_moe=0.5)

    def test_filter_by_state(self):
        pass

    def test_filter_by_year(self):
        pass
