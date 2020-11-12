JSON Structure Documentation
============================

2020-07-28

..  contents:: :local: 

Overview
--------
In order to support both a reasonable structured storage approach to the CARTS questions and their answers, and a component-based frontend that will allow changes to be made in configuration rather than code (up to a point), we use a JSON document approach. To do this, we need to have structures to represent the various elements of the CARTS form.

The purpose of this structure is not to mimic the structure of the online form, but to contain the information needed to create and populate that form and also to create and populate a report document.

The form is hierarchical::

    Section
        Subsection
            Part
                Question
                    Subquestion

However, a variety of special cases make the hierarchy less straightforward (in particular, ``repeatables`` and ``objectives``).

The ``fieldset`` construct is not quite analogous to the HTML element with the same name; in most cases they go together, but not always. See `Fieldsets`_ for more information.

The conditional logic of various parts of the CARTS form is complicated, and attempting to represent that in JSON via some sort of domain-specific language would be unwise. A system design goal is that changes to text, reordering the questions, deleting questions, or adding new questions (that don't alter the conditional logic, at least) should be all be possible via altering the data in the backend, and this approach should achieve that. Changes to the conditional logic, however, will continue to require software development changes.

The conditional logic for questions with difficult logic is therefore described in plain language in the backend data, but these descriptions are not intended to be machine-readable.

The conditional logic for the simple logic is described in `Conditional display`_.

In addition, the logic for how `objectives`_ work in Section 2B work is described below, and no attempt is made to store that logic within the data for the system.

The structure of the JSON can be validated against `backend-section.schema.json`_ using JSON Schema. That schema is likely to be more up-to-date than this document, so if there's a contradiction, assume the schema file is correct.

.. _backend-section.schema.json: ./backend-section.schema.json

Frontend–backend data exchange
++++++++++++++++++++++++++++++
The frontend will know what the parameters for the data request are, primarily: year, state, and section of the form. When given a request for ``/<year>/<state>/<section>``, the backend will respond with a JSON document, the structure of which is described in this documentation. That JSON will contain many nested elements with ``entry`` properties. If these are populated (representing data that a user has already entered), the fronted will display those as answers in the form.

As new answers are added by the user, the frontend will send POST requests containing the JSON document to the backend. Essentially, the JSON sent by the frontend will be identical to the JSON it received, except that now various elements' ``entry`` properties will be populated.

The role of the frontend in this context is to keep track of what part of the JSON document corresponds to data the user is entering, change the JSON accordingly, and send this JSON back to the server as changes are made.

As an example, if the form had a Section 23 and that section was extremely simple, the backend JSON for it in 2020 for California might look like this:

.. code:: json

    {
        "year": 2020,
        "state": "CA",
        "ordinal": 23,
        "type": "section",
        "title": "Simplicity",
        "subsections": [{
                "header": "Brevity",
                "type": "subsection",
                "id": "2020-23-a",
                "parts": [{
                        "id": "2020-23-a-01",
                        "type": "part",
                        "header": "Sagacity",
                        "questions": [{
                                "id": "2020-23-a-01-01",
                                "type": "text",
                                "text": "To be, or not to be?",
                                "answer": {
                                    "type": "string",
                                    "entry": null
                                }}]}]}]}

If the user answered the long question with “Take up arms against a sea of troubles”, the frontend would send this to the backend:

.. code:: json

    {
        "year": 2020,
        "state": "CA",
        "ordinal": 23,
        "type": "section",
        "title": "Simplicity",
        "subsections": [{
                "header": "Brevity",
                "type": "subsection",
                "id": "2020-23-a",
                "parts": [{
                        "id": "2020-23-a-01",
                        "type": "part",
                        "header": "Sagacity",
                        "questions": [{
                                "id": "2020-23-a-01-01",
                                "type": "text",
                                "text": "To be, or not to be?",
                                "answer": {
                                    "type": "string",
                                    "entry": "Take up arms against a sea of troubles"
                                }}]}]}]}

JSON–component translation
++++++++++++++++++++++++++
The frontend components expect JSON-like data for their configuration, but while this is similar to the JSON provided by the backend, it isn't the same, and cannot be identical without overly intermingling form and presentation. Implementing this translation will probably result in some changes to the backend's JSON structure, although hopefullly these will be minimal.

Notes on ``id`` 
++++++++++++++++
Every construct with an ``id`` has the ``id`` of the nearest parent with an ``id`` plus a hyphen and its own representation, which for most constructs is a two-digit number with a leading zero, starting at "01". Subsections and questions whose parent elements are questions use letter representations, starting with ``a``.

If a part's ``id`` is 2020-05-e-01, the first child question of that part would have the ``id`` ``2020-05-e-01-01``, and if that question had a child question, its ``id`` would be ``2020-05-e-01-01-a``. For the purposes of this representation, objectives and goals are treated as structures similar to parts (and thus don't use letter markers), not as questions, which explains the ``id`` values found in Section 2B.

Not yet covered
+++++++++++++++
+   File upload.

Special requirements
++++++++++++++++++++
Section 1
    This section's parts 3 and 4 contain an identical long list of questions, all with yes/no answers. The JSON for these is the only place where ``bullet_text`` is used. The last question in each of the parts is displayed if any of questions 1–19 in that part were answered with ``yes``, in which case the last question is displayed and the ``bullet_text`` value for each of the questions with a ``yes`` answer is displayed somewhere nearby (depends on the design).
Section 2A
    This section starts with two tables, both of which are filled with data from other sources. This data will be entered into the JSON, but will not be editable by states. Each of the tables is followed by a question whose display is conditional upon values in the table. This all requires custom code.
Section 2B
    See `objectives`_ below.
Section 3C
    A tablehouse of horrors whose structure and content is still under review.
Section 3D
    All of the rest of the questions after 1 should be hidden if the answer to 1 is no; this looks like it can be handled via the supported conditional logic. However, in addition, question 8 should only be displayed if the answer to Section 1 Part 3 Question 8 (``2020-01-a-03-08``) or Section 1 Part 4 Question 8 (``2020-01-a-04-08``) is yes. That will require custom frontend code.
Section 3E
    This only applies to a specific subset of states, and should be skipped or shown based on information about states that will have to be handled with custom code.

    In addition, questions 12–17 have their answers compiled into a table for display, interaction that will be handled entirely in custom code.
Section 3I
    The HSI Programs here are repeatables, similar to goals in Section 2B.

Section
-------
The top-level construct is a section. Sections have the following properties:

``year``
    Four-digit integer.

    Corresponds to the year that the report is covering. For example, the annual report that states can submit at the start of October 2020, covering fiscal year 2019–2020, would be ``2020``.
``id``
    String.

    ``year``-``section``
``state``
    Two-digit string.

    The state submitting the report.

    Despite the name, this covers the District of Columbia, and would also cover any future non-state regions that might be added to the system.
``valid``
    Boolean.
    
    This status is determined by the backend. Note that incomplete submissions, while invalid, will still be accepted as input by the API. This status is primarily informational and doesn't indicate that the sytem will refuse to accept or certify the section.
``ordinal``
    Integer.
    
    Section 1 has ordinal ``1``, etc.
``type``
    String.

    At this time it is assumed that this will always be ``section``, but this is currently being included as a hedge.
``title``
    String.
    
    The title for the section, for example “Program Fees and Policy Changes”.
``subsections``
    Array of ``subsection`` constructs.
``text`` (optional)
    String.

    Additional text that should be presented at the beginning of the section.
``comment`` (optional)
    String.

    Comment directed at developer or admin users.

Subsection
----------
Some sections have subsections, some only have parts, but the structure expects an intervening subsection even if it is singular.

Subsections are contained by sections.

Subsections, like subquestions, are represented by letters rather than numbers.

``type``
    String

    Presumably always ``subsection``.
``ordinal``
    Integer.
``id``
    String

    ``year``-``section``-``subsection``

    For example, Section 1 only has one subsection, and so the user shouldn't see references to any subsections for it, and its ``id`` would be ``2020-01-a``.

    Section 2 has subsections, for example Section 2b would have an ``id`` of ``2020-02-b``
``parts``
    Array of ``part`` constructs.
``text`` (optional)
    String.

    Additional text that should be presented at the beginning of the subsection. This text can be made into multiple paragraphs by using the newline character ``\n``.
``comment`` (optional)
    String.

    Comment directed at developer or admin users.

Part
----
Some sections/subsections are divided into parts. If there are no parts, the entire content is considered to be in one part.

Parts are contained by subsections.

``id``
    String.

    ``year``-``section``-``subsection``-``ordinal``.

    Examples:
        :Section 1 Part 1 for 2020: ``2020-01-a-01``
        :Section 2b Part 1 for 2020: ``2020-02-b-01``
``type``
    String.

    Presumably always ``part``.
``questions``
    Array of ``question`` constructs.
``text`` (optional)
    String.

    Additional text that should be presented at the beginning of the part.
``context_data``
    Object.

    Contains information about whether or not to show the construct, and under what circumstances, as well as some other display hinting. See below.
``comment`` (optional)
    String.

    Comment directed at developer or admin users.

``context_data``
----------------
A property that contains data about whether and/or how the segment should be displayed.

``bullet_text`` (optional)
    String.

    Summary text for an answer to be displayed in list form; only applied to Section 1.
``display_prior_year_data`` (optional)
    Boolean.

    Present and ``true`` if the UI is supposed to display data from the prior year as an aid to data entry.
``enable_copying_prior_year_data`` (optional)
    Boolean.

    Present and ``true`` if the UI is supposed to help the user copy over data from the prior year.
``conditional_display`` (optional)
    Extremely limited logic mini-schema to control display of questions. See `Conditional display`_ below.
``interactive_conditional`` (optional)
    String.

    Plain-language description of how the logic for displaying the question in the entry form is supposed to work.

    Should only be used if the logic is too convoluted for ``conditional_display`` to handle.
``noninteractive_conditional`` (optional)
    String.

    Plain-language description of how the logic for displaying the question in the review output is supposed to work.

    Should only be used if the logic is too convoluted for ``conditional_display`` to handle.
``show_if_state_program_type_in`` (optional)
    Array of program categories.

    The only valid values here are:
    
    +   ``medicaid_exp_chip``
    +   ``separate_chip``
    +   ``combo``

    The part is only displayed if the state program is one of the listed categories. Otherwise, the content of ``skip_text`` is displayed. Listing all three values in the array is equivalent to omitting the property (that is, the part will be shown in all cases).
``skip_text`` (optional)
    String.

    The text to be displayed for a state if the state's program is not listed in ``show_if_state_program_type_in``.

Question
-------------------------------------
The construct that will contain user-submitted data, as well as presentation information.

Questions can contain other questions, so questions have either questions or parts as containing constructs.


``id``
    String.

    ``year``-``section``-``subsection``-``part``-``question-and-descendants``.

    For example, Section 1 Subsection 1 Part 1 Question 1 for 2020 has the id ``2020-01-a-01-01``, Section 1 Subsection 1 Part 1 Question 1a for 2020 has the id ``2020-01-a-01-01-a``.
``type``
    String.

    The kind of question construct. The various types are described in the `Question Types`_ section. 
``label``
    String.

    The text of the question.
``hint`` (optional)
    String.

    Hint text for the question.
``comment`` (optional)
    String.

    Comment directed at developer or admin users.
``answer`` (optional)
    An ``answer`` construct. Most but not all question types have this property.
``questions`` (optional)
    Array of ``question`` constructs.

    These are sub-questions.

Answer
------
The construct that contains technical details about how the question should be answered, and the value of any data that users have entered.

Answers are contained by questions, which in this case is a technical description and not a koan.

``entry``
    The user-entered data responding to the question.
``comment`` (optional)
    String.

    Comment directed at developer or admin users.
``default_entry`` (optional)
    String.

    In rare cases we want to prepopulate the value of the user's answer. This is not the same as a hint, as this value will be sent to the database as if it had been entered by the user. We think we want this field to allow us to distinguish between sections that have been accessed by the user and those that haven't, but it's possible that this property is unnecessary.

Conditional display
-------------------
This is about per-question display, and not about the per-part display related to whether a state's program is separate CHIP, Medicaid expansion CHIP, or combo; see ``show_if_state_program_type_in`` in `Part`_ for that functionality.

The default for all questions, in both interactive and noninteractive views, is for them to be displayed unless a specific condition applies. The specific condition is the value of the ``entry`` property for a question, and this functionality supports only checking for whether that value matches any of the values in a supplied list.

``type``
    String.

    Always ``conditional_display``.
``comment``
    Plain-language description of the logic. For example:
        
        Interactive: Hide if 2020-01-a-01-01 is no or unanswered; noninteractive: hide if that's no.
``skip_text`` (optional)
    String.

    The text that should appear instead of the question if the conditional logic indicates the question itself should not be displayed. If blank or absent, indicates that no such text should appear.
``hide_if``
    This construct describes the conditions under which the question should be hidden from view. It has two properties, ``target`` and ``values``, and the frontend will evaluate the current value of the JSON element specified by ``target`` and hide it from view if that value is in the array of values specified for the current view type (``interactive`` or ``noninteractive``).

    No other forms of logic are supported by the construct, and must be described using the ``interactive_conditional`` and ``noninteractive_conditional`` properties and then implemented manually on the frontend.o

    ``target``
        String.

        This is a `JSON Path`_ expression that points to the location in the JSON to find the value to be evaluated. Normally this will be the value of an ``entry`` property. The vast majority of these will refer to ``id`` values. For example, to find the value of ``entry`` for a question with the ``id`` of ``2020-01-a-01-01``, the expression would be ``$..*[?(@.id=='2020-01-a-01-01')].answer.entry``. The assumption is that changing these values will almost always be a question of simply changing the ``id`` and leaving the rest of the expression unchanged.
    ``values``
        This object has two properties, ``interactive`` and ``noninteractive``, both of which are an array of values. The values should be integers, strings, or ``null``, where ``null`` represents the absence of an answer.
``hide_if_all``
    This construct describes the conditions under which the question should be hidden from view. It has two properties, ``targets`` and ``values``, and the frontend will evaluate the current value of the JSON elements specified by ``targets`` and hide it from view if all values are in the array of values specified for the current view type (``interactive`` or ``noninteractive``).

    No other forms of logic are supported by the construct, and must be described using the ``interactive_conditional`` and ``noninteractive_conditional`` properties and then implemented manually on the frontend.o

    ``targets``
        Array[String].

        This is an array of `JSON Path`_ expressions that points to the locations in the JSON to find the values to be evaluated. Normally this will be the values of an ``entry`` property. The vast majority of these will refer to ``id`` values. For example, to find the value of ``entry`` for a question with the ``id`` of ``2020-01-a-01-01``, the expression would be ``$..*[?(@.id=='2020-01-a-01-01')].answer.entry``. The assumption is that changing these values will almost always be a question of simply changing the ``id`` and leaving the rest of the expression unchanged.
    ``values``
        This object has two properties, ``interactive`` and ``noninteractive``, both of which are an array of values. The values should be integers, strings, or ``null``, where ``null`` represents the absence of an answer.

Section 1 has the question “Does your program charge an enrollment fee?”, with the sub-question “How much is your enrollment fee?”. In the interactive view, the sub-question should only be displayed if the user has answered ``yes`` to the parent question, and hidden in the other cases.

The ``id`` for the first question is ``2020-01-a-01-01``, and it allows for answers only of ``yes``, ``no``, and ``null``:

..  code:: json

        "id": "2020-01-a-01-01",
        "text": "Does your program charge an enrollment fee?",
        "type": "radio",
        "answer": {
            "options": [
                { "label": "Yes", "value": "yes" },
                { "label": "No", "value": "no" }
            ],
            "entry": null
        }

To express the logic described above, the sub-question has this ``conditional_display``:
    
..  code:: json

    "conditional_display": {
        "type": "conditional_display",
        "comment": "Interactive: Hide if 2020-01-a-01-01 is no or unanswered; noninteractive: hide if that's no.",
        "hide_if": {
            "target": "$..*[?(@.id=='2020-01-a-01-01')].answer.entry",
            "values": {
                "interactive": [null, "no"],
                "noninteractive": ["no"]
            }
        }
    }

.. _JSON Path: https://goessner.net/articles/JsonPath/

``hide_if_table_value``
    This construct describes the conditions under which the question should be hidden from view. It has several properties, ``target``, ``computed``, ``variation_operator``, and ``variations``. ``Variations`` is an object with the following properties ``threshold``, ``operator``, ``row``, and ``row_key``. The frontend will evaluate the current value of the JSON elements specified by ``target`` and hide it from view if the values fall within the threshold provided.

    This is valuable for determining if a value falls above or below a specified threshold. This can be compared against an array of items, a compareACS (computed) value and a seds (computed) field.

    ``target``
        String.

        This is an string of `JSON Path`_ expression that points to the locations in the JSON to find the values to be evaluated against. Normally this will be the values of an ``entry`` property. The vast majority of these will refer to ``id`` values. For example, to find the value of ``entry`` for a question with the ``id`` of ``2020-01-a-01-01``, the expression would be ``$..*[?(@.id=='2020-01-a-01-01')].answer.entry``. The assumption is that changing these values will almost always be a question of simply changing the ``id`` and leaving the rest of the expression unchanged.
    ``computed``
        Bool.

        This determines if the target is a synthesized table (true) or a non-interactive table (false).

    ``variation_operator``
        String.

        Options: `or` or `and`. Select `or` for items that should resolve true if ANY of the variations are true. Use `and` when all variations must resolve true.

    ``variations``
        Array[Objects]

        Variations house the data to determine if a comparison resolves as true or false.

        ``threshold``
            String.

            Enter the number that is being compared against. (E.g. if checking that a value is greater than 3, set threshold to 3)

        ``operator``
            String.

            Options: `>`, `<`, `=`, `!=`. Set which operator for the comparison

        ``row``
            String.

            Options: *(all), number. This corresponds with the row number from the `target` table. This field starts at 0. For the second row, select 1.

        ``row_key``
            Number.

            This is the column, or row index. If attempted to read the 3rd value in a row, select 2.


Section 2 has question 1. “What are some reasons why the number and/or percent of uninsured children has changed?”, This question is shown only if the value from the preceding table is less than -3 OR greater than +3.

The ``fieldset_id`` for the target table is ``noninteractive-table-2-1``, and will show if the value is either less than -3 or greater than +3.

Example of non-interactive table (note the fieldset_id)
.. code:: json
    {
        "type": "fieldset",
        "fieldset_type": "noninteractive_table",
        "fieldset_id": "noninteractive-table-2-1",
        "fieldset_info": {
          "headers": [
            "Program",
            "Number of children enrolled in FFY 2019",
            "Number of children enrolled in FFY 2020",
            "Percent change"
          ],
          "rows": [
            [
              "Medicaid Expansion CHIP",
              284143,
              300579,
              5.78
            ],
            [
              "Separate CHIP",
              478542,
              511473,
              6.88
            ]
          ]
        },
        "questions": []
    },

Below is an example of the conditional display for the above example.
..  code:: json

        "conditional_display": {
            "type": "conditional_display",
            "hide_if_table_value": {
              "target": "$..*[?(@.fieldset_id=='noninteractive-table-2-1')].fieldset_info.rows",
              "computed": false,
              "variation_operator": "or",
              "variations": [
                {
                  "threshold": "3",
                  "operator": ">",
                  "row": "*",
                  "row_key": "3"
                },
                {
                  "threshold": "-3",
                  "operator": "<",
                  "row": "*",
                  "row_key": "3"
                }
              ]
            }
          }

Question types
--------------
This section describes the characteristics and properties (in addition to those described in the Answer section) of answer constructs of a given question type that are specific to that type of question.

Fieldsets
+++++++++
Fieldsets serve two basic functions as constructs in the JSON:
    +   As containers for multiple questions, with text that applies to all the questions in the fieldset rather than to particular questions.
    +   As ways of handling special cases, normally one that involve grouping questions together or presenting data in ways other than the typical question-answer approach.


Fieldsets are not meant to alter the hierarchy of the document. For example, the following questions are all at the same level::

    Question 1
    Question 2
    Question 3
    Question 4

If the middle two questions were inside a fieldset, they are still at the same level, and do not switch to using letters::

    Question 1
    Fieldset
        Question 2
        Question 3
    Question 4

Fieldsets do not have ``id`` properties, and the questions within them increment their ``id`` properties as if the fieldset container were not present.

``fieldset_type`` (optional)
    String.

    Some fieldsets display synthetic values for the benefit of the user that are not sent to the backend and which are derived from the answers to the questions within the fieldset. One example might be ``sum``, and another is ``percentage`` (in the latter case, the percentage is the first value divided by the second value times 100).
``fieldset_info`` (options)
    Object.

    Some fieldset types require additional info, which is stored here. Other than having to be in an object, the structure of this value is not constrained.
``show_if_state_program_type_in`` (optional)
    Array of program categories.

    The only valid values here are:
    
    +   ``medicaid_exp_chip``
    +   ``separate_chip``
    +   ``combo``

    The fieldset is only displayed if the state program is one of the listed categories. Otherwise, the content of ``skip_text`` is displayed. Listing all three values in the array is equivalent to omitting the property (that is, the part will be shown in all cases).

Special ``fieldset`` types
**************************
Special ``fieldset`` types that don't necessarily contain questions. They must still have a ``questions`` field because these uses are outliers and it makes more sense to require the field for the vast majority of uses that do contain questions.

``datagrid``
############
The child questions of a ``datagrid`` ``fieldset`` should be grouped together and presented as a table, possibly without showing their question markers. Currently the only design for this (in, of course, Section 3C) has four questions presented as a single row. As a result, the ``fieldset_info`` details are still undetermined, and will probably change during Section 3C development.

``marked``
##########
Thanks to Section 3C, we need a ``fieldset`` type that *does* have an ``id`` property, and *does* act as if it were a real question and thus the questions it contains are marked as subquestions. So that's what this is for. Essentially, it's a ``question`` that can't actually accept answers; all the other parts of a question component except the actual input element.

Because ``fieldset`` can't have an ``id`` property, we have to store the ``id`` for these in the ``fieldset_info`` object, which may be annoying at implementation time. However, this kind of ``fieldset`` will require custom handling anyway, and adding that wrinkle will hopefully not be too difficult.

Other ``fieldset`` instances nested below it do not inherit its ``marked`` nature.

``synthesized_value``
#####################
Get values from elsewhere, defined in the ``targets`` property, perform some action(s) upon them, defined in the ``actions`` property, and display the result.

Both ``targets`` and ``actions`` expect arrays.

For convenience, there is also a ``contents`` property that can be used instead of the above if all that's desired is to display a literal value. This property isn't too useful on its own (because you could just put the literal value into the ``label`` property of a fieldset), but becomes useful with ``synthesized_table``, which expects objects of the same shape.

The value of the ``contents`` property can be a string, integer, or float.

Supported actions are:

``identity``
    Return the value unchanged, except that it's now in an array.
``sum``
    Add all of the values and return the result. This probably implies casting them to number types first.
``percentage``
    Divide the contents of the first target by the contents of the second target, multiply by 100. This probably implies casting them to number types first. The default is to round to two decimal places, but if a ``precision`` property is also present, its integer value will be used to determing how many digits of precision are required (``0`` would mean round to the nearest integer, ``2`` would mean round to the second decimal place, etc.),
``rpn``
    Given the list of targets, apply the RPN string provided in the ``rpn`` property. ``@`` characters in the RPN string will be replaced sequentially target values. The RPN string should be space delimited, with operators and operands being separated by a single space character. This string can include numeric constants, e.g., ``@ @ @ 9 + + /`` is equivalent to ``(@ + @ + @) /9``, where the ``@`` values are replaced with target values.


The property is called ``actions``, but hopefully we'll only ever need to have one action listed, and thus won't have to define what happens in what order if there are multiple values.

If ``actions`` is empty, we should assume that this is equivalent to having a value of ``["identity"]``.

Example of ``sum``:

..  code:: json

    {
      "type": "fieldset",
      "questions": [
        {
          "id": "2020-02-b-01-01-01-01",
          "label": "How many fables were you told?",
          "type": "integer",
          "answer": { "entry": null }
        },
        {
          "id": "2020-02-b-01-01-01-02",
          "label": "How many fairy tales were you told?",
          "type": "integer",
          "answer": { "entry": null }
        }
      ]
    },
    {
      "type": "fieldset",
      "fieldset_type": "synthesized_value",
      "label": "Total number of loosely-defined tales of the fantastical",
      "fieldset_info": {
        "targets": [
          "$..*[?(@.id=='2020-02-b-01-01-01-01')].answer.entry",
          "$..*[?(@.id=='2020-02-b-01-01-01-02')].answer.entry"
        ],
        "actions": ["sum"]
      }
    }


The above would display the two questions, and below them a label followed by the sum of the two answers.

Example of ``percentage``:

..  code:: json

    {
      "type": "fieldset",
      "questions": [
        {
          "id": "2020-02-b-01-01-01-01",
          "label": "How many fables were you told?",
          "type": "integer",
          "answer": { "entry": null }
        },
        {
          "id": "2020-02-b-01-01-01-02",
          "label": "How many stories were you told?",
          "type": "integer",
          "answer": { "entry": null }
        }
      ]
    },
    {
      "type": "fieldset",
      "fieldset_type": "synthesized_value",
      "label": "Total number of loosely-defined tales of the fantastical",
      "fieldset_info": {
        "targets": [
          "$..*[?(@.id=='2020-02-b-01-01-01-01')].answer.entry",
          "$..*[?(@.id=='2020-02-b-01-01-01-02')].answer.entry"
        ],
        "actions": ["percentage"],
        "precision": 0

      }
    }


The above would display the two questions, and below them a label followed by a percentage (100 × the number of fables divided by the number of stories). Because ``precision: 0`` is present, the number would be rounded to the nearest integer.

Example of ``identity``:

..  code:: json

    {
      "type": "fieldset",
      "fieldset_type": "synthesized_value",
      "label": "Your answer to Section 1A, Part 23, Question 147",
      "fieldset_info": {
        "targets": [
          "$..*[?(@.id=='2020-01-a-23-147')].answer.entry",
        ],
        "actions": ["identity"]
      },
    },
    {
      "type": "fieldset",
      "questions": [
        {
          "id": "2020-02-b-01-01-01-01",
          "label": "Attempt to justify your above answer to Section 1A, Part 23, Question 147",
          "type": "integer",
          "answer": { "entry": null }
        }
      ]
    }

The above would display a question accompanied by the user's answer to the indicated question from another section.

Example of using ``contents``:

..  code:: json

    {
      "type": "fieldset",
      "fieldset_type": "synthesized_value",
      "label": "The temperature in Fahrenheit at 01:00 in St. Petersburg on Valentine's Day, 1998",
      "fieldset_info": {
        "contents": 12.2,
      },
    }

The above would display ``The temperature in Fahrenheit at 01:00 in St. Petersburg on Valentine's Day, 1998`` and ``12.2``.

Example of using ``rpn``:

..  code:: json

    {
      "type": "fieldset",
      "fieldset_type": "synthesized_value",
      "label": "Total number of loosely-defined tales of the fantastical",
      "fieldset_info": {
        "targets": [
          "$..*[?(@.id=='q1')].answer.entry",
          "$..*[?(@.id=='q2')].answer.entry"
          "$..*[?(@.id=='q3')].answer.entry"
          "$..*[?(@.id=='q4')].answer.entry"
        ],
        "actions": ["rpn"],
        "rpn": "@ @ @ @ 3 + - / *"
      }
    }

The above would display a value equal to ``(((q1 + q2) - q3) / q4) * 3``

``synthesized_table``
########################
This displays a table constructed out of values either provided by or indicated in the ``fieldset_info`` property.

The ``fieldset_info`` property contains two fields, ``headers`` and ``rows``.

``headers`` is an array containing the values for the header row of the table. 

``rows`` is a two-dimensional array; each item is an array containing the values for that row of the table.

Values for those arrays are objects with the same shape as those for ``synthesized_value``, that is, with either a ``contents`` property or both ``targets`` and ``actions`` properties.


An example:

..  code:: json

    {
      "type": "text",
      "id": "2020-01-a-01",
      "answer": {
        "entry": "I'm over here"
      }
    },
    {
      "type": "text",
      "id": "2020-01-a-02",
      "answer": {
        "entry": "And I'm over here"
      }
    },
    {
      "type": "fieldset",
      "fieldset_type": "synthesized_table",
      "fieldset_info": {
        "headers": [{"contents": "Contents"}, {"contents": "Targets"}],
        "rows": [
          [
            {"contents": "From the server"},
            {"targets": ["$..*[?(@.id=='2020-01-a-01')].answer.entry"], "actions": ["identity"]}
          ],
          [
            {"contents": "Also from the server"},
            {"targets": ["$..*[?(@.id=='2020-01-a-02')].answer.entry"]}
          ],
        ]
      },
      "questions": []
    }

This would produce something like:

    ====================  =================
    Contents              Targets
    ====================  =================
    From the server       I'm over here
    Also from the server  And I'm over here
    ====================  =================

I omitted the ``actions`` property from the second row because ``["identity"]`` is its default value.

This is an example of using both ``identity`` and ``sum`` in a table:

..  code:: json

    {
      "type": "fieldset",
      "questions": [
        {
          "id": "2020-02-b-01-01-01-01",
          "label": "How many fables were you told?",
          "type": "integer",
          "answer": { "entry": null }
        },
        {
          "id": "2020-02-b-01-01-01-02",
          "label": "How many fairy tales were you told?",
          "type": "integer",
          "answer": { "entry": null }
        }
      ]
    },
    {
      "type": "fieldset",
      "fieldset_type": "synthesized_table",
      "label": "Fantastical narratives data summary",
      "fieldset_info": {
        "headers": [
          {"contents": "Fables"},
          {"contents": "Fairy tales"},
          {"contents": "Total number of loosely-defined tales of the fantastical"},
        ],
        "rows": [
          {"targets": ["$..*[?(@.id=='2020-02-b-01-01-01-01')].answer.entry"]},
          {"targets": ["$..*[?(@.id=='2020-02-b-01-01-01-02')].answer.entry"]},
          {
            "targets": [
              "$..*[?(@.id=='2020-02-b-01-01-01-01')].answer.entry",
              "$..*[?(@.id=='2020-02-b-01-01-01-02')].answer.entry",
            ],
            "actions": ["sum"]
          }
        ]
      }
    }

I omitted the ``actions`` property for brevity where it would have been the default value.

Assuming the answers to the two questions were ``2`` and ``3``, the above would produce something like:

    ..  table:: Fantastical narratives data summary

        ======  ===========  ========================================================
        Fables  Fairy tales  Total number of loosely-defined tales of the fantastical
        ======  ===========  ========================================================
             2            3                                                         5
        ======  ===========  ========================================================


``noninteractive_table``
########################
This displays a non-interactive table out of values provided.

This is essentially a simplification of ``synthesized_table`` where there are no values dependent on form elements and so the contents can be passed to the array as primitives rather than being in the ``contents`` property of an object.

The ``fieldset_info`` property contains two fields, ``headers`` and ``rows``.

``headers`` is an array containing the values for the header row of the table. 

``rows`` is a two-dimensional array; each item is an array containing the values for that row of the table.

Values for those arrays can be strings, integers, or floats.

An example:

..  code:: json

    {
      "type": "fieldset",
      "fieldset_type": "noninteractive_table",
      "fieldset_info": {
        "headers": ["Ones", "Twos", "Threes", "Fours"],
        "rows": [
          [1, 2, 3, 4],
          [11, 22, 33, 44],
          ["1 1 1", "2 2 2", "3 3 3", "4 4 4"],
          [1111, 2222, 3333, 5555]
        ]
      },
      "questions": [
        {
          "id": "2020-02-a-01",
          "label": "How does this table make you feel?",
          "type": "text_multiline",
          "answer": {"entry": null}
        }
      ]
    }

This would produce something like:

    =====  =====  ======  =====
    Ones   Twos   Threes  Fours
    =====  =====  ======  =====
    1      2      3       4
    11     22     33      44
    1 1 1  2 2 2  3 3 3   4 4 4
    1111   2222   3333    5555
    =====  =====  ======  =====

    How does this table make you feel?

``unmarked_descendants``
########################

This fieldset contains questions that aren't really being collected and are purely ways of letting users indicate that they do not have the ability to answer certain questions—for example, in the infamous Section 3C, Part 4 has a checkbox that lets the user indicate whether or not they only have totals for the following questions, or whether they have breakdowns\ [#]_. Since the following answers will make clear what data they have available, the state of the checkbox isn't really part of the collected data. It'll still be recorded, but will be marked as distinct.

The main implications of this are that questions in an ``unmarked_descendants`` fieldset (or any questions that are descendants of an ``unmarked_descendants`` fieldset) do not have list markers, and their ids do not follow the structure of other ids.

The values for the ``id`` properties of the questions that are descendants of an ``unmarked_descendants`` fieldset should be the same as the question immediately preceding them, but with ``-unmarked_descendants`` appended. For example, in Section 3C Part 4, the aforementioned checkbox comes right after question ``2020-03-c-04-01``. I would therefore give its ``id`` property a value of ``2020-03-c-04-01-unmarked_descendants``. If there were multiple ``unmarked_descendants`` questions for some reason, I would increment them as if they were real questions—but ``-unmarked_descendants`` would still need to be appended to their ``id`` values.

.. [#]  Data broken down into age cohorts, not the other kind of breakdown associated with exposure to that section.

``text_multiline``
++++++++++++++++++
A long string. As this will probably be represented by the ``TEXT`` type in Postgres, its max length should be longer than anything we will realistically encounter. Its ``entry`` value should be represented as a string. It has optional properties:

``max_length``
    Integer.

    The maximum length of the string. Note that the backend may reject submissions with answers longer than this limit, rather than simply marking them as invalid and accepting the input.

    If absent or set to 0, no limit will be enforced.
``min_length``
    Integer.

    The minimum length of the string. The backend will accept submissions with answers shorter than this limit and may mark them as invalid.

    If absent or set to 0, no minimum will be enforced.

``text``
+++++++++++++++++++++++++
A text entry field that doesn't need multiple lines.

``text_medium``
+++++++++++++++++++++++++
A small-ish text entry field.

``text_small``
+++++++++++++++++++++++++
A small text entry field.

``radio``
+++++++++
A set of choices, only one of which can be chosen. Its ``entry`` value should be represented as a string.

``options``
    Array of available choices.

    Each choice is an object with a user-facing label in the `label` property and the the data representation in the `value` property.

    For example, a yes/no radio question would have this as its ``options``: ``[{ "label": "Yes", "value": "yes" }, { "label": "No", "value": "no"}]``.

``checkbox``
++++++++++++
A set of choices, multiples of which can be chosen. Its ``entry`` value should be represented as an array of strings, where those strings are values from the ``options`` property.

``options``
    Array of available choices.

    Each choice is an object with a user-facing label in the `label` property and the the data representation in the `value` property.

    For example, a checkbox asking which characteristics of ideas apply would have this ``options`` property::

        [
            { "label": "Colorless", "value": "colorless" },
            { "label": "Green", "value": "green" },
            { "label": "Sleeping", "value": "sleeping" }
        ]


``checkbox_flag``
+++++++++++++++++
A single checkbox; if checked, its value is ``True``, otherwise it's ``null`` or ``False``. It does not have an ``answer.options`` property.

``money``
+++++++++
A short string that can represent an integer or a float. Constrained to two decimal places.

``integer``
+++++++++++
An integer.

``file_upload``
+++++++++++++++
Not yet implemented.

``daterange``
+++++++++++++
``labels``
    Array of two strings.

    The labels for the start and end of the range.

The ``entry`` value should be sent to the server as an array of two strings, with each of those strings being an ISO 8601 date. For example, no matter how the dates are represented or entered on the frontend, the range from the Fourth of July 2014 and September 23rd 2014 should be sent to the backend as ``["2014-07-04", "2014-09-23"]``.

``ranges``
++++++++++
A number of ranges. Its ``entry`` value should be represented as a three-dimensional array of strings, broadly equivalent to tables, table rows, and table cells.

Possibly the most complex construct in terms of implementation; objectives and goals are probably the most complex in terms of representation.

``header`` (optional)
    String.

    Brief text about the range, supplemental to the question text and the range categories.
``range_categories``
    Array of arrays of strings. Each inner array of strings represents the start and end of a range.
``range_types``
    Array of strings, corresponding to the range categories. The strings are the kind of value that will be accepted as valid for that range.
``entry_min``
    Integer.

    The minimum number of “rows” that will be regarded as a valid answer. If absent or set to 0, submitting no rows will be allowed as valid.
``entry_max``
    Integer.

    The maximum number of “rows” that will be regarded as a valid answer. If absent or set to 0, there will be no row limit.

For example, we want to ask about the state program's tier levels are if their fees are tiered by Federal Poverty Level; we want an answer similar to:

    | “21%–40% FPL: $30–$50”
    | “41%–60% FPL: $60–$80”

At least one row is required, but there is no limit to the number of rows a user can enter.

The ``answer`` construct would be:
    
    ..  code:: javascript

        {
            "range_categories": [["FPL starts at", "FPL ends at"], ["Premium fee starts at", "Premium fee ends at"]],
            "range_types": ["percentage", "money"],
            "entry_min": 1
            "entry_max": 0
        }

If the user entered data stating that answer was the same as our example, i.e. equivalent to the two rows “21%–40% FPL: $30–$50” and “41%–60% FPL: $60–$80”, the ``answer`` construct with a populated ``entry`` property would be:
    
    ..  code:: javascript

        {
            "range_categories": [["FPL starts at", "FPL ends at"], ["Premium fee starts at", "Premium fee ends at"]],
            "range_types": ["percentage", "money"],
            "entry_min": 1
            "entry_max": 0
            "entry": [
                [["21", "40"], ["30", "50"]],
                [["41", "60"], ["60", "80"]],
            ]
        }

``objectives``
++++++++++++++
A particular construct specific to Section 2B. They contain repeatables, a construct specific to Section 2B and Section 3I.

Essentially, repeatables are a set of questions that can be repeated a number of times. Each objective may have any number of goals, and goals are addressed by a specific set of questions, so whenever a new goal is created, a new copy of that set of questions is added to the form. HSI programs, from Section 3I, are similar in that any number of them can be entered by the user, and the questions for each one are identical (HSI programs don't have a container construct similar to ``objective``.)

Objectives are handled as different types because they, unlike the others, can themselves contain other repeatables.

The ``objective`` and ``repeatable`` answer types are broadly equivalent to ``part`` constructs, except that the user enters an arbitrary number of them.

Allowing users to enter an arbitary number of objectives and an arbitrary number of goals per objective does not lend itself to a simple schema, at least not one we've found so far; in our defense we can only say that we think the implementation of the following will not be as bad as its description.

The first objective in an array of objectives has an answer—the description of the objective—set in the database, and that answer cannot be updated by the user. Subsequent objectives have user-editable descriptions.

Questions of the type ``objectives`` have a ``questions`` property, and the immediate children in that array must be questions of type ``objective``.

Questions of the type ``objective`` have a ``questions`` property, and the immediate children in that array must be a question of the type ``text_multiline`` (for the description) and question of the type ``repeatables``.

Questions of the type ``repeatables`` have a ``questions`` property, and the immediate children in that array must be questions of the type ``repeatable``.

Questions of the type ``repeatables`` have a ``typeLabel`` property, and this property is what is displayed on the front end as the label for the immediate children questions of type repeatable.

Questions of the type ``repeatable`` have a ``questions`` property, and these questions aren't constrained in terms of their types.

The term “goal” below means a ``repeatable`` construct that's being used to represent a goal that is part of an objective's set of goals. HSI programs in Section 2B are handled similarly, except that there's only one level of repeatable there so it's simpler.

The frontend must allow users to create new objectives, and to create new goals in a given objective. A newly-created objective is created with one goal.

The API JSON representation of the first goal in the first objective is the template for any further goals, and the API JSON representation of the first objective is the template for any further objectives.

There must be at least one of these in their arrays at any time: the ``objectives`` property must contain at least one ``objective``, and the ``repeatables`` property must contain at least one ``repeatable``.

The first ``objective`` is a special case in that its first question isn't displayed; its displayed content begins with its first goal. That first question has ``answer.readonly`` and ``answer.default_entry`` properties set. Removing these is part of creating the structure for a new objective.

When creating new goals and/or objectives, the frontend must

+   Copy the last item in the corresponding array of objectives or goals.
+   Set all ``entry`` properties at all levels of the new construct to be empty.
+   For new objectives:
    +   Delete all but the first goal in the new construct.
    +   For the first question, in addition to setting ``answer.entry`` to ``null``, delete the ``answer.readonly`` and ``answer.default_entry`` properties.

+   Set the ``id`` properties at all levels of the new construct to the appropriate values.

    For example, the first ``objectives`` question in Section 2B has an ``id`` of ``2020-02-b-01-01`` (year, section, subsection, part, question).
    
    The lone (initial) direct child in its ``questions`` property has a type of ``objective``, and an ``id`` of ``2020-02-b-01-01-01`` (year, section, subsection, part, question, objective).

    The first direct child of the ``questions`` property of that ``objective`` question has a type of ``text_multiline``, and an ``id`` of ``2020-02-b-01-01-01-01`` (year, section, subsection, part, question, objective, question).

    The second direct child of the ``questions`` property of that ``objective`` question has a type of ``repeatables``, and an ``id`` of ``2020-02-b-01-01-01-02`` (year, section, subsection, part, question, objective, question).

    The lone (initial) direct child of the ``questions`` property of that ``repeatables`` question has a type of ``repeatable``, and an ``id`` of ``2020-02-b-01-01-01-02-01`` (year, section, subsection, part, question, objective, question, goal).

    The first direct child of the ``questions`` property of that ``repeatable`` question can have any type (other than ``objectives``, ``objective``, ``repeatables``, or ``repeatable``, you monster), and an ``id`` of ``2020-02-b-01-01-01-02-01-01`` (year, section, subsection, part, question, objective, question, goal, question).

    While this sounds appalling, in practice for a new goal the frontend just has to copy the previous goal and increment the ``id`` properties accordingly. So with the above example, the first goal of the first objective has the ``id`` ``2020-02-b-01-01-01-02-01``, so the frontend would replace that string in every ``id`` field in the new goal (which would be the second goal) with ``2020-02-b-01-01-01-02-02``.

    For a new objective, a similar approach applies: the first objective in the above example has the ``id`` ``2020-02-b-01-01-01``, so the frontend would copy it and its children, including its first goal, and then in all child ``id`` properties replace the string ``2020-02-b-01-01-01`` with the string ``2020-02-b-01-01-02`` (because this would be the second objective).

+   Append the new construct to the end of the appropriate array.

This is one approach to the above process for adding a new objective (it assumes that the structure for Section 2 has already been parsed from JSON and is avaliable as ``sectionTwo``):

..  code:: javascript

    const jp = require('jsonpath');

    /* Get objective by referring to id of objectives item and then getting the last thing in that
    item's questions array: */
    const lastObjective = jp.query(sectionTwo, "$..*[?(@.id=='2020-02-b-01-01')].questions[-1:]");

    const priorId = lastObjective[0].id; // "2020-02-b-01-01-01"
    let deconstructedId = priorId.split("-");
    const last = (1 + parseInt(deconstructedId.pop(), 10)).toString().padStart(2, '0');
    deconstructedId.push(last);
    const newId = deconstructedId.join("-"); // "2020-02-b-01-01-02"

    // Convert it to string for two reasons.
    // First reason: to ensure we're doing a deep copy, not a shallow copy.
    const stringifiedFirstObjective = JSON.stringify(lastObjective);
    // Second reason: replace all references to the prior ID with the new ID
    const stringifiedNewObjective = stringifiedFirstObjective.split(priorId).join(newId);

    let newObjective = JSON.parse(stringifiedNewObjective);

    // Remove the default_entry and readonly keys:
    delete newObjective[0].questions[0].answer.readonly;
    delete newObjective[0].questions[0].answer.default_entry;

    // Set all answer.entry values to null:
    jp.apply(newObjective, "$..*[?(@.answer.entry)].answer.entry", function (value) {
        return null;
    });

    // Add the new objective to the questions property array for the objectives item:
    jp.apply(sectionTwo, "$..*[?(@.id=='2020-02-b-01-01')].questions", function (value) {
        return value.concat(newObjective);
    });

``objective``
+++++++++++++
A child construct of the ``objectives`` construct. This should have two values in its ``questions`` property, one of the type ``text_multiline`` for the description of the objective, and one of the type ``repeatables`` to contain the goals for the objective.

``repeatables``
+++++++++++++++
A child construct of the ``objective`` construct or the ``part`` construct. This should have at least one value in its ``questions`` property, and all of the values in its ``questions`` property should be of the type ``repeatable``.

``repeatable``
++++++++++++++
A child construct of the ``repeatables`` construct. This can have questions of any type in its ``questions`` property, but as suggested above, if you attempt to put questions of the types ``objectives``, ``repeatables``, or ``repeatable`` here we won't be happy and suspect you won't be either.

Practical Editing Considerations
--------------------------------
JSON Schema can be somewhat fragile, and this one is relatively complicated. In addition, there are some practical steps for getting changes made to files in this directory (``docs/section-schemas``) through to the database. The process for handling this is:

+   Add a file for the new section if there isn't one already, with the same naming scheme as the others, in ``/docs/section-schemas``.
+   Install the Python ``jsonschema`` module locally.
+   Run ``jsonschema -i [one of the existing schemas] backend-section.schema.json`` to cover the bases and make sure there are no problems with either your jsonschema command or the existing ones in your local tree. Note that that command-line ``jsonschema`` interface requires you to add ``-i`` before the name of every file you want to validate against the schema.
+   As you edit the new schema, run ``jsonchema`` against it more or less every time you make a change, because the error reporting can be unhelpful if you're trying to track things down after having made a lot of changes.
+   The ``id`` properties are both finicky and important—see `Notes on id`_—and there's currently no process for automating their generation. When you're done with it otherwise, and it's validating, run the ``validate_id.py`` Python script against your new section. It should flag some errors if they're there. This script is very hacky and very fallible, however.
+   If you want the section to be visible for as specific state, such as Alaska, you will need to copy it and name it the same way the other state-specific files have been named, e.g. ``2020-ak-section-3.json``. Files named this way will get picked up by the script in the next step. These files can be more or less straight copies of the generic section files, but do need to have their top-level ``state`` property set to the two-letter state code (e.g. ``AK``). At time of writing, it only makes sense to create files specific to ``AK``, ``AZ``, and ``MA``.
+   Once done, run the ``generate_fixtures.py`` script in that directory. It will wrap the JSON in a Django-friendly object and copy it (and the rest of the relevant files) to the ``/frontend/api_postgres/fixtures`` directory.
+   Kill your running docker-compose process and run ``docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up --build`` to bring it back up. During startup the new fixtures will be loaded, and once API and UI are up you should be able to see the changes you made. If the new fixture is a generic one not associated with any state, it should be visible at <http://localhost:8000/api/v1/sections/2020/[n]/> where `[n]` is the section number. If it's associated with a state, it should be visible as just data at <http://localhost:8000/api/v1/sections/2020/[state_abbr]/[n]/>  and in the app itself <http://localhost:81/sections/2020/[n]/?dev=dev-[lowercase_state_abbr]> should do it. Note that currently the mock dev users as specified in the URL's ``dev`` param are limited to ``ak``, ``az``, and ``ma``.
