from rest_framework import permissions


class StateViewSectionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user, view_name = request.user, view.get_view_name()
        if request.user.has_perm("carts_api.view_section"):
            print(f"User {user} has view permissions for {view_name}.")
            return True

        obj_state = obj.contents["section"]["state"]
        required_permission = f"carts_api.view_state_{obj_state}".lower()
        print(f"checking {user} for {required_permission}", flush=True)
        return user.has_perm(required_permission)


class StateChangeSectionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user, view_name = request.user, view.get_view_name()
        if request.user.has_perm("carts_api.change_section"):
            print(f"User {user} has admin permissions for {view_name}.")
            return True

        obj_state = obj.contents["section"]["state"]
        required_permission = f"carts_api.change_state_{obj_state}".lower()
        print(f"POST checking {user} for {required_permission}", flush=True)
        return request.user.has_perm(required_permission)
