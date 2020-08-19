const addNewObjective = (newObjectiveId) => {
    let objectiveIdString = "";
    if (newObjectiveId < 9) { objectiveIdString = "0" + newObjectiveId }
    const newGoalId = 1;//It was throwing an error when I just put 1 for newGoalId
    return (
        {
            "type": "objective",
            "id": `2020-02-b-01-01-${objectiveIdString}`,
            "questions": [
                {
                    "type": "text_multiline",
                    "label": "What is your objective as listed in your state plan?",
                    "hint": "For example: Our objective is to increase enrollment in our CHIP program.",
                    "id": `2020-02-b-01-01-${objectiveIdString}-01`,
                    "answer": {
                        "readonly": false,
                        "default_entry": "",
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-${objectiveIdString}-02`,
                    "type": "repeatables",
                    "questions": [
                        addNewGoal(newGoalId)
                    ]
                }]


        })
}

const addNewGoal = (newGoalId) => {
    let goalIdString = "";
    if (newGoalId < 9) { goalIdString = "0" + newGoalId }
    return (
        {
            "id": `2020-02-b-01-01-01-02-${goalIdString}`,
            "type": "repeatable",
            "questions": [
                {
                    "id": `2020-02-b-01-01-01-02-${goalIdString}-01`,
                    "label": "Briefly describe your goal.",
                    "hint": "For example: Enroll 75% of eligible children in the CHIP program.",
                    "type": "text_multiline",
                    "answer": {
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${goalIdString}-02`,
                    "label": "What type of goal is it?",
                    "type": "radio",
                    "answer": {
                        "options": {
                            "New goal": "goal_new",
                            "Continuing goal": "goal_continuing",
                            "Discontinued goal": "goal_discontinued"
                        },
                        "default_entry": "goal_new",
                        "entry": null
                    },
                    "questions": [
                        {
                            "id": `2020-02-b-01-01-01-02-${goalIdString}-02-a`,
                            "label": "Why was this goal discontinued?",
                            "type": "text_multiline",
                            "answer": {
                                "entry": null
                            },
                            "context_data": {
                                "conditional_display": {
                                    "type": "conditional_display",
                                    "comment": `Interactive: Hide if 2020-02-b-01-01-01-02-${newGoalId}-02 is null, continuing goal, or new goal; noninteractive: hide if that's continuing goal or new goal.`,
                                    "hide_if": {
                                        "target": `$..*[?(@.id=="2020-02-b-01-01-01-02-${newGoalId}-02")].answer.entry`,
                                        "values": {
                                            "interactive": [
                                                null,
                                                "goal_continuing",
                                                "goal_new"
                                            ],
                                            "noninteractive": [
                                                "goal_continuing",
                                                "goal_new"
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "label": "Define the numerator you're measuring",
                    "questions": [
                        {
                            "id": `2020-02-b-01-01-01-02-${newGoalId}-03`,
                            "label": "Which population are you measuring in the numerator?",
                            "hint": "For example: The number of children enrolled in CHIP in the last federal fiscal year.",
                            "type": "integer",
                            "answer": {
                                "entry": null
                            }
                        },
                        {
                            "id": `2020-02-b-01-01-01-02-${newGoalId}-04`,
                            "label": "Numerator (total number)",
                            "type": "integer",
                            "answer": {
                                "entry": null
                            }
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "label": "Define the denominator you're measuring",
                    "questions": [
                        {
                            "id": `2020-02-b-01-01-01-02-${newGoalId}-05`,
                            "label": "Which population are you measuring in the denominator?",
                            "hint": "For example: The total number of eligible children in the last federal fiscal year.",
                            "type": "integer",
                            "answer": {
                                "entry": null
                            }
                        },
                        {
                            "id": `2020-02-b-01-01-01-02-${newGoalId}-06`,
                            "label": "Denominator (total number)",
                            "type": "integer",
                            "answer": {
                                "entry": null
                            }
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "fieldset_type": "percentage",
                    "fieldset_info": {
                        "numerator": "$..*[?(@.id==`2020-02-b-01-01-01-02-${newGoalId}-04`)].answer.entry",
                        "denominator": "$..*[?(@.id==`2020-02-b-01-01-01-02-${newGoalId}-06`)].answer.entry"
                    },
                    "questions": []
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-07`,
                    "label": "What is the date range of your data?",
                    "type": "daterange",
                    "answer": {
                        "labels": [
                            "Start",
                            "End"
                        ],
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-08`,
                    "label": "Which data source did you use?",
                    "type": "radio",
                    "answer": {
                        "options": {
                            "Eligibility or enrollment data": "goal_enrollment_data",
                            "Survey data": "goal_survey_data",
                            "Another data source": "goal_other_data"
                        },
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-09`,
                    "label": "How did your progress towards your goal last year compare to your previous year\u2019s progress?",
                    "type": "text_multiline",
                    "answer": {
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-10`,
                    "label": "What are you doing to continually make progress towards your goal?",
                    "type": "text_multiline",
                    "answer": {
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-11`,
                    "label": "Anything else you'd like to tell us about this goal?",
                    "type": "text_multiline",
                    "answer": {
                        "entry": null
                    }
                },
                {
                    "id": `2020-02-b-01-01-01-02-${newGoalId}-12`,
                    "label": "Do you have any supporting documentation?",
                    "hint": "Optional",
                    "type": "file_upload",
                    "answer": {
                        "entry": null
                    }
                }
            ]
        }
    );
}

export { addNewGoal, addNewObjective }