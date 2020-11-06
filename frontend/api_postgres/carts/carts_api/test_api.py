from django.test import TestCase
from carts.carts_api.models import State, FMAP, ACS
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase


class StateTestCase(APITestCase):
    def setUp(self):
        State.objects.create(code="AK", name="Alaska")
        FMAP.objects.create(
            state_id="AK", fiscal_year=2020, enhanced_FMAP=65.7
        )
        ACS.objects.create(
            state_id="AK",
            year=2019,
            number_uninsured=2000,
            number_uninsured_moe=500,
            percent_uninsured=4.3,
            percent_uninsured_moe=0.4,
        )

    def test_state_retrieval(self):
        # test that  API endpoint properly  filters by state
        response = self.client.get("/state/AK/", format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["acs_set"]), 1)
        self.assertEqual(len(response.data["fmap_set"]), 1)
