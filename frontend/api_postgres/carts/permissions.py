from rest_framework import permissions


class StateViewSectionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        obj_state = obj.contents['section']['state']
        required_permission = f'carts_api.view_state_{obj_state}'.lower()
        print(f'checking {request.user} for {required_permission}')
        return request.user.has_perm(required_permission)


class StateChangeSectionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        obj_state = obj.contents['section']['state']
        required_permission = f'carts_api.change_state_{obj_state}'.lower()
        print(f'checking {request.user} for {required_permission}')
        return request.user.has_perm(required_permission)
