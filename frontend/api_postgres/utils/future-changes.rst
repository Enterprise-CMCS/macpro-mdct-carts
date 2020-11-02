
+   **Changing a question's conditional logic**
        
    +   To change what answer hides a question, change the values in the question's ``context_data.conditional_display.hide_if.values`` property, both interactive and noninteractive. Ensure that the new values are the values of the question this depends on.

        If the property isn't present at all, the easiest way to do this is to copy and paste the ``context_data`` property from a question that does have conditional display and change the values contained in it. Pay particular attention to all of the ``id`` values in it.

        More fully described here: https://github.com/CMSgov/cms-carts-seds/blob/master/frontend/api_postgres/utils/section-schemas/backend-json-structure-documentation.rst#conditional-display

    +   To change what program type a question should be shown for, change its ``context_data.show_if_program_type_in`` value or values. The valid values are ``combo``, ``medicaid_exp_chip``, and ``separate_chip``.

        If the property isn't present, add a ``context_data`` property that is a dictionary with two properties, ``show_if_program_type_in``, which takes an array of strings values as just described, and, optionally, ``skip_text``.

        More fully described here: https://github.com/CMSgov/cms-carts-seds/blob/master/frontend/api_postgres/utils/section-schemas/backend-json-structure-documentation.rst#context-data

+   **Deleting a question**

    +   The easy part of this is removing the question from the JSON. The more difficult aspect is that all following questions in that part must have their ``id`` values changed to reflect the new numbering of the questions. See here for more details: https://github.com/CMSgov/cms-carts-seds/blob/master/frontend/api_postgres/utils/section-schemas/backend-json-structure-documentation.rst#notes-on-id

+   **Changing the order of questions**
    +   If conditional logic isn't involved, the primary issue is ensuring that the ``id`` values of both questions are correct. See here for more details: https://github.com/CMSgov/cms-carts-seds/blob/master/frontend/api_postgres/utils/section-schemas/backend-json-structure-documentation.rst#notes-on-id
    +   If conditional logic is involved, particularly in the case where the questions being moved are referred to by ``id`` in the ``conditional_display`` property of other questions, ensure that all of the referring ``id`` values are updated.

+   **Adding a question**

    The easiest way to do this is simply to copy another question's JSON and change the ``id`` and other values. However, if this question is added anywhere except the end of the part (or as a final subquestion), adding it is likely to require changing the ``id`` values of all the subsequent questions at that nesting level.

+   **Adding a part/subsection/section**

    Adding a part to a subsection anywhere except the end will require changing the ``id`` values of all subsequent parts—and all of the questions contained within them—in that subsection.

    The same applies to adding a subsection, where all subsequent subsections will have to have all of the ``id`` values in all of the contained levels changed.

    Adding a section has the same considerations at the section level.

    In all cases, the most efficient way to do this is via a series of find-and-replace steps, since ``id`` values are unique and the portions of them that need to change will be evident from what level is being changed.

+   **Adding a non-question widget/function/etc**

    This requires coding work, probably the creation of a new React component to handle whatever is necessary. This should probably be a new type of fieldset, as fieldsets in the JSON are set up to be the ways in which special cases are handled. This should be possible without adding new properties to the schema, but there may be cases where that's not true. In cases where the JSON schema must be changed, it's important to ensure that all existing content still validates.

+   **Adding a new type of question, one which requires changing the JSON Schema**

    This should only be done if it can't be done with a new fieldset type for some reason. The first priority with any changes or additions to the JSON schema is to make sure that all of the existing content validates against the new schema. As with the prior item, this will require coding work to ensure that the frontent can render the new type of question, probably via a new React component.

+   **Changing the structure to the extent that the JSON Schema has to be changed**
    
    Structural changes to the JSON will require the schema be updated to match the new structure, and should involve close collaboration between those responsible for the content and those responsible for the frontend code. There could be backend code implications here as well, if for some reason the basic section/subsection/part hierarchy is altered, a change that is definitely not recommended.

+   **Changing something about objectives/goals/HSI programs**

    Changes to these areas may be purely content-based, but, depending on how extensive they are, may require code changes. In particular, anything relating to how many objective/goals/HSI programs are shown, or limits to the number of them, or anything involving the differences between the first answer and the other answers, will require coding changes.

+   **Replacing the entire frontend**

    This could be done without altering the backend or the JSON schema or content. The primary focus would be on ensuring that all of the existing components are covered by the new system in terms of functionality, and that the new system uses the same model of interacting with the authentication that the current one does.

+   **Replacing the entire backend**

    Almost any backend system could be set up to have endpoints that send and receive the JSON as expected by the current system. Here, the keys would be to ensure that the endpoints remain the same from the perspective of the frontend, that the authentication/user management works in the same way, and that the document flow, particularly in terms of what statuses are valid as the next stage from any given current status.

Types of changes
----------------
Anything that only changes display style should be frontend-only. Anything that changes the behavior of questions should be frontend-only.

Adding new content that conforms to the schema should require JSON editing only, and should not require frontend or backend coding unless entirely new behavior is introduced.

Adding new user roles, or other changes related to user management, will require backend changes. It's possible that some frontend changes might also be required here, but this would primarily be a question of changing the frontend routing for a new user type.

Changes to the way in which CMS EUA handles job codes and/or LDAP groups, or in the way that Okta passes those along, will require backend changes, as the job code/LDAP group values are a key part of what the system relies upon to determine what access a user has.
