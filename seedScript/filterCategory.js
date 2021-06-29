const filterSeed = [
    // {
    //     "_id" : 1,
    //     "status" : "Active",
    //     "language" : [ 
    //         {
    //             "langCode" : "en",
    //             "_id" : "5f51c30a6f7f897193b26a3f",
    //             "name" : "Seats",
    //             "values" : []
    //         }, 
    //         {
    //             "langCode" : "ar",
    //             "_id" : "5f51c30a6f7f897193b26a3e",
    //             "name" : "مقاعد",
    //             "values" : []
    //         }
    //     ],
    //     "min" : 1,
    //     "max" : 16,
    //     "inputTag" : "range",
    //     "createdAt" : "2020-09-04T04:31:06.253Z",
    //     "updatedAt" : "2020-09-04T04:31:06.253Z"
    // },
    {
        "_id" : 2,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f52109e8bacd50d9315389f",
                "name" : "Country",
                "values" : [ 
                    {
                        "_id" : "5f52109e8bacd50d931538a0",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52109e8bacd50d931538a4",
                                "valueChildData" : "India"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d931538a3",
                                "valueChildData" : "United States "
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d931538a2",
                                "valueChildData" : "Canada"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d931538a1",
                                "valueChildData" : "Australia"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f52109e8bacd50d93153899",
                "name" : "بلد",
                "values" : [ 
                    {
                        "_id" : "5f52109e8bacd50d9315389a",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52109e8bacd50d9315389e",
                                "valueChildData" : "الهند"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d9315389d",
                                "valueChildData" : "الولايات المتحدة الأمريكية"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d9315389c",
                                "valueChildData" : "كندا"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d9315389b",
                                "valueChildData" : "أستراليا"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f52109e8bacd50d93153893",
                "name" : "Pays",
                "values" : [ 
                    {
                        "_id" : "5f52109e8bacd50d93153894",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52109e8bacd50d93153898",
                                "valueChildData" : "Inde"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d93153897",
                                "valueChildData" : "États Unis"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d93153896",
                                "valueChildData" : "Canada"
                            }, 
                            {
                                "_id" : "5f52109e8bacd50d93153895",
                                "valueChildData" : "Australie"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-04T10:02:06.541Z",
        "updatedAt" : "2020-09-04T10:02:06.541Z"
    },
    {
        "_id" : 3,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5214ea8bacd50d931538a7",
                "name" : "Passed Year",
                "values" : []
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5214ea8bacd50d931538a6",
                "name" : "Année passée",
                "values" : []
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5214ea8bacd50d931538a5",
                "name" : "عام مضى",
                "values" : []
            }
        ],
        "min" : 2000,
        "max" : 2020,
        "inputTag" : "range",
        "createdAt" : "2020-09-04T10:20:26.902Z",
        "updatedAt" : "2020-09-04T10:20:26.902Z"
    },
    {
        "_id" : 4,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5219388bacd50d931538d5",
                "name" : "Job type",
                "values" : [ 
                    {
                        "_id" : "5f5219388bacd50d931538d6",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219388bacd50d931538da",
                                "valueChildData" : "Software Engg"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d9",
                                "valueChildData" : "Construction"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d8",
                                "valueChildData" : "Electrical"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d7",
                                "valueChildData" : "Management "
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5219388bacd50d931538cf",
                "name" : "نوع الوظيفة",
                "values" : [ 
                    {
                        "_id" : "5f5219388bacd50d931538d0",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219388bacd50d931538d4",
                                "valueChildData" : "هندسة البرمجيات"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d3",
                                "valueChildData" : "اعمال بناء"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d2",
                                "valueChildData" : "الكهرباء"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538d1",
                                "valueChildData" : "إدارة"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5219388bacd50d931538c9",
                "name" : "Type d'emploi",
                "values" : [ 
                    {
                        "_id" : "5f5219388bacd50d931538ca",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219388bacd50d931538ce",
                                "valueChildData" : "Logiciel Engg"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538cd",
                                "valueChildData" : "Construction"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538cc",
                                "valueChildData" : "Électrique"
                            }, 
                            {
                                "_id" : "5f5219388bacd50d931538cb",
                                "valueChildData" : "La gestion"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-04T10:38:48.551Z",
        "updatedAt" : "2020-09-04T10:38:48.551Z"
    },
    {
        "_id" : 5,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5219aa8bacd50d931538e3",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f5219aa8bacd50d931538e4",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219aa8bacd50d931538e6",
                                "valueChildData" : "Sale"
                            }, 
                            {
                                "_id" : "5f5219aa8bacd50d931538e5",
                                "valueChildData" : "Rent"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5219aa8bacd50d931538df",
                "name" : "نوع",
                "values" : [ 
                    {
                        "_id" : "5f5219aa8bacd50d931538e0",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219aa8bacd50d931538e2",
                                "valueChildData" : "تخفيض السعر"
                            }, 
                            {
                                "_id" : "5f5219aa8bacd50d931538e1",
                                "valueChildData" : "تأجير"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5219aa8bacd50d931538db",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f5219aa8bacd50d931538dc",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5219aa8bacd50d931538de",
                                "valueChildData" : "Location"
                            }, 
                            {
                                "_id" : "5f5219aa8bacd50d931538dd",
                                "valueChildData" : "Vente"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-04T10:40:42.366Z",
        "updatedAt" : "2020-09-04T10:40:42.366Z"
    },
    {
        "_id" : 6,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f521a268bacd50d931538e9",
                "name" : "Square Yards",
                "values" : []
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f521a268bacd50d931538e8",
                "name" : "ياردة مربعة",
                "values" : []
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f521a268bacd50d931538e7",
                "name" : "Yards carrés",
                "values" : []
            }
        ],
        "min" : 150,
        "max" : 100000,
        "inputTag" : "range",
        "createdAt" : "2020-09-04T10:42:46.910Z",
        "updatedAt" : "2020-09-04T10:42:46.910Z"
    },
    {
        "_id" : 7,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f521ad68bacd50d931538f2",
                "name" : "Condition",
                "values" : [ 
                    {
                        "_id" : "5f521ad68bacd50d931538f3",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521ad68bacd50d931538f5",
                                "valueChildData" : "Used "
                            }, 
                            {
                                "_id" : "5f521ad68bacd50d931538f4",
                                "valueChildData" : "New"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f521ad68bacd50d931538ee",
                "name" : "شرط",
                "values" : [ 
                    {
                        "_id" : "5f521ad68bacd50d931538ef",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521ad68bacd50d931538f1",
                                "valueChildData" : "مستخدم"
                            }, 
                            {
                                "_id" : "5f521ad68bacd50d931538f0",
                                "valueChildData" : "جديد"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f521ad68bacd50d931538ea",
                "name" : "état",
                "values" : [ 
                    {
                        "_id" : "5f521ad68bacd50d931538eb",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521ad68bacd50d931538ed",
                                "valueChildData" : "utilisé"
                            }, 
                            {
                                "_id" : "5f521ad68bacd50d931538ec",
                                "valueChildData" : "Nouveau"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-04T10:45:42.051Z",
        "updatedAt" : "2020-09-04T10:45:42.051Z"
    },
    {
        "_id" : 8,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f521db78bacd50d93153908",
                "name" : "Property Category",
                "values" : [ 
                    {
                        "_id" : "5f521db78bacd50d9315390d",
                        "valueParent" : "Residential Land",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d93153910",
                                "valueChildData" : "Single story "
                            }, 
                            {
                                "_id" : "5f521db78bacd50d9315390f",
                                "valueChildData" : "Two Story"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d9315390e",
                                "valueChildData" : "Three Story"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f521db78bacd50d93153909",
                        "valueParent" : "Vacant land ",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d9315390c",
                                "valueChildData" : "Red soil "
                            }, 
                            {
                                "_id" : "5f521db78bacd50d9315390b",
                                "valueChildData" : "Grey soil"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d9315390a",
                                "valueChildData" : "Black soil"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f521db78bacd50d931538ff",
                "name" : "فئة الملكية",
                "values" : [ 
                    {
                        "_id" : "5f521db78bacd50d93153904",
                        "valueParent" : "أرض للإقامة",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d93153907",
                                "valueChildData" : "قصة واحدة"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d93153906",
                                "valueChildData" : "قصتان"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d93153905",
                                "valueChildData" : "ثلاث طوابق"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f521db78bacd50d93153900",
                        "valueParent" : "أرض خالية",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d93153903",
                                "valueChildData" : "التربة الحمراء"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d93153902",
                                "valueChildData" : "التربة الرمادية"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d93153901",
                                "valueChildData" : "التربة السوداء"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f521db78bacd50d931538f6",
                "name" : "catégorie de propriété",
                "values" : [ 
                    {
                        "_id" : "5f521db78bacd50d931538fb",
                        "valueParent" : "Terrains résidentiels",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d931538fe",
                                "valueChildData" : "Histoire unique"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d931538fd",
                                "valueChildData" : "Deux histoires"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d931538fc",
                                "valueChildData" : "trois histoires"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f521db78bacd50d931538f7",
                        "valueParent" : "terrain vacant",
                        "valueChild" : [ 
                            {
                                "_id" : "5f521db78bacd50d931538fa",
                                "valueChildData" : "Sol rouge"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d931538f9",
                                "valueChildData" : "Sol gris"
                            }, 
                            {
                                "_id" : "5f521db78bacd50d931538f8",
                                "valueChildData" : "Terre noire"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "multilevel",
        "createdAt" : "2020-09-04T10:57:59.675Z",
        "updatedAt" : "2020-09-04T10:57:59.675Z"
    },
    {
        "_id" : 9,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5220628bacd50d93153912",
                "name" : "Mileage (MI)",
                "values" : []
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5220628bacd50d93153911",
                "name" : "عدد الأميال",
                "values" : []
            }
        ],
        "min" : 1000,
        "max" : 100000,
        "inputTag" : "range",
        "createdAt" : "2020-09-04T11:09:22.585Z",
        "updatedAt" : "2020-09-04T11:09:22.585Z",
        "__v" : 0
    },
    {
        "_id" : 10,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f52234e8bacd50d93153927",
                "name" : "Make",
                "values" : [ 
                    {
                        "_id" : "5f52234e8bacd50d9315392e",
                        "valueParent" : "BMW",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153930",
                                "valueChildData" : "X3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d9315392f",
                                "valueChildData" : "X4"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d9315392b",
                        "valueParent" : "Benz",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d9315392d",
                                "valueChildData" : "C-Class"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d9315392c",
                                "valueChildData" : "GLS- Class"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d93153928",
                        "valueParent" : "Tesla",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d9315392a",
                                "valueChildData" : "Model 3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d93153929",
                                "valueChildData" : "Model S"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f52234e8bacd50d9315391d",
                "name" : "يصنع",
                "values" : [ 
                    {
                        "_id" : "5f52234e8bacd50d93153924",
                        "valueParent" : "بي إم دبليو",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153926",
                                "valueChildData" : "X3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d93153925",
                                "valueChildData" : "X4"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d93153921",
                        "valueParent" : "بنز",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153923",
                                "valueChildData" : "الفئة- C"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d93153922",
                                "valueChildData" : "فئة GLS"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d9315391e",
                        "valueParent" : "تسلا",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153920",
                                "valueChildData" : "النموذج 3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d9315391f",
                                "valueChildData" : "عارضات ازياء"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f52234e8bacd50d93153913",
                "name" : "Faire",
                "values" : [ 
                    {
                        "_id" : "5f52234e8bacd50d9315391a",
                        "valueParent" : "BMW",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d9315391c",
                                "valueChildData" : "X3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d9315391b",
                                "valueChildData" : "X4"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d93153917",
                        "valueParent" : "Benz",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153919",
                                "valueChildData" : "Classe C"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d93153918",
                                "valueChildData" : "GLS - Classe"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f52234e8bacd50d93153914",
                        "valueParent" : "Tesla",
                        "valueChild" : [ 
                            {
                                "_id" : "5f52234e8bacd50d93153916",
                                "valueChildData" : "Modèle 3"
                            }, 
                            {
                                "_id" : "5f52234e8bacd50d93153915",
                                "valueChildData" : "Des modèles"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "multilevel",
        "createdAt" : "2020-09-04T11:21:50.832Z",
        "updatedAt" : "2020-09-04T11:21:50.832Z",
    },
    {
        "_id" : 11,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5224428bacd50d9315393b",
                "name" : "Gender",
                "values" : [ 
                    {
                        "_id" : "5f5224428bacd50d9315393c",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5224428bacd50d9315393f",
                                "valueChildData" : "Male"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d9315393e",
                                "valueChildData" : "Female"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d9315393d",
                                "valueChildData" : "Others"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5224428bacd50d93153936",
                "name" : "جنس",
                "values" : [ 
                    {
                        "_id" : "5f5224428bacd50d93153937",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5224428bacd50d9315393a",
                                "valueChildData" : "الذكر"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d93153939",
                                "valueChildData" : "أنثى"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d93153938",
                                "valueChildData" : "الآخرين"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5224428bacd50d93153931",
                "name" : "Le sexe",
                "values" : [ 
                    {
                        "_id" : "5f5224428bacd50d93153932",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5224428bacd50d93153935",
                                "valueChildData" : "Mâle"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d93153934",
                                "valueChildData" : "Femme"
                            }, 
                            {
                                "_id" : "5f5224428bacd50d93153933",
                                "valueChildData" : "autres"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-04T11:25:54.309Z",
        "updatedAt" : "2020-09-04T11:25:54.309Z"
    },
    {
        "_id" : 12,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5224868bacd50d93153942",
                "name" : "Age",
                "values" : []
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5224868bacd50d93153941",
                "name" : "عمر",
                "values" : []
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5224868bacd50d93153940",
                "name" : "âge",
                "values" : []
            }
        ],
        "min" : 18,
        "max" : 65,
        "inputTag" : "range",
        "createdAt" : "2020-09-04T11:27:02.504Z",
        "updatedAt" : "2020-09-04T11:27:02.504Z",
    },
    {
        "_id" : 13,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f5235a88bacd50d93153958",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f5235a88bacd50d9315395c",
                        "valueParent" : "Swedish massage",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d9315395e",
                                "valueChildData" : "1 Hour"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d9315395d",
                                "valueChildData" : "more than 1 hour"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f5235a88bacd50d93153959",
                        "valueParent" : "Hot stone massage",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d9315395b",
                                "valueChildData" : "1 Hour"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d9315395a",
                                "valueChildData" : "More than 1 hour"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f5235a88bacd50d93153951",
                "name" : "نوع",
                "values" : [ 
                    {
                        "_id" : "5f5235a88bacd50d93153955",
                        "valueParent" : "التدليك السويدية",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d93153957",
                                "valueChildData" : "1 ساعة"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d93153956",
                                "valueChildData" : "أكثر من ساعة"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f5235a88bacd50d93153952",
                        "valueParent" : "تدليك الحجر الساخن",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d93153954",
                                "valueChildData" : "1 ساعة"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d93153953",
                                "valueChildData" : "أكثر من ساعة"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f5235a88bacd50d9315394a",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f5235a88bacd50d9315394e",
                        "valueParent" : "Massage suédois",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d93153950",
                                "valueChildData" : "1 heure"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d9315394f",
                                "valueChildData" : "Plus d'une heure"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f5235a88bacd50d9315394b",
                        "valueParent" : "massage aux pierres chaudes",
                        "valueChild" : [ 
                            {
                                "_id" : "5f5235a88bacd50d9315394d",
                                "valueChildData" : "1 heure"
                            }, 
                            {
                                "_id" : "5f5235a88bacd50d9315394c",
                                "valueChildData" : "plus d'une heure"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "multilevel",
        "createdAt" : "2020-09-04T12:40:08.458Z",
        "updatedAt" : "2020-09-04T12:40:08.458Z"
    },
    {
        "_id" : 14,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55d714693b511a8a7b8d08",
                "name" : "Education",
                "values" : [ 
                    {
                        "_id" : "5f55d714693b511a8a7b8d0d",
                        "valueParent" : "BE",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8d10",
                                "valueChildData" : "Telecom Engg"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d0f",
                                "valueChildData" : "Bio Medical Engg"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d0e",
                                "valueChildData" : "System Engg"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f55d714693b511a8a7b8d09",
                        "valueParent" : "ARTS",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8d0c",
                                "valueChildData" : "BA"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d0b",
                                "valueChildData" : "B.com"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d0a",
                                "valueChildData" : "English literature "
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f55d714693b511a8a7b8cff",
                "name" : "التعليم",
                "values" : [ 
                    {
                        "_id" : "5f55d714693b511a8a7b8d04",
                        "valueParent" : "BE",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8d07",
                                "valueChildData" : "هندسة الاتصالات"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d06",
                                "valueChildData" : "الهندسة الطبية الحيوية"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d05",
                                "valueChildData" : "هندسة النظام"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f55d714693b511a8a7b8d00",
                        "valueParent" : "الفنون",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8d03",
                                "valueChildData" : "بكالوريوس"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d02",
                                "valueChildData" : "B.com"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8d01",
                                "valueChildData" : "أدب إنجليزي"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f55d714693b511a8a7b8cf6",
                "name" : "Éducation",
                "values" : [ 
                    {
                        "_id" : "5f55d714693b511a8a7b8cfb",
                        "valueParent" : "ÊTRE",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8cfe",
                                "valueChildData" : "Telecom Engg"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8cfd",
                                "valueChildData" : "Bio Medical Engg"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8cfc",
                                "valueChildData" : "Système Engg"
                            }
                        ]
                    }, 
                    {
                        "_id" : "5f55d714693b511a8a7b8cf7",
                        "valueParent" : "ARTS",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55d714693b511a8a7b8cfa",
                                "valueChildData" : "BA"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8cf9",
                                "valueChildData" : " B.com"
                            }, 
                            {
                                "_id" : "5f55d714693b511a8a7b8cf8",
                                "valueChildData" : "Littérature anglaise"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "multilevel",
        "createdAt" : "2020-09-07T06:45:40.409Z",
        "updatedAt" : "2020-09-07T06:45:40.409Z"
    },
    {
        "_id" : 15,
        "status" : "Active",
        "language" : [ 
            {
                "langCode" : "en",
                "_id" : "5f55dc29693b511a8a7b8d34",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f55dc29693b511a8a7b8d35",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55dc29693b511a8a7b8d37",
                                "valueChildData" : "Head Massage"
                            }, 
                            {
                                "_id" : "5f55dc29693b511a8a7b8d36",
                                "valueChildData" : "Full Body Massage"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "ar",
                "_id" : "5f55dc29693b511a8a7b8d30",
                "name" : "نوع",
                "values" : [ 
                    {
                        "_id" : "5f55dc29693b511a8a7b8d31",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55dc29693b511a8a7b8d33",
                                "valueChildData" : "تدليك الرأس"
                            }, 
                            {
                                "_id" :"5f55dc29693b511a8a7b8d32",
                                "valueChildData" : "تدليك لكامل الجسم"
                            }
                        ]
                    }
                ]
            }, 
            {
                "langCode" : "fr",
                "_id" : "5f55dc29693b511a8a7b8d2c",
                "name" : "Type",
                "values" : [ 
                    {
                        "_id" : "5f55dc29693b511a8a7b8d2d",
                        "valueParent" : "",
                        "valueChild" : [ 
                            {
                                "_id" : "5f55dc29693b511a8a7b8d2f",
                                "valueChildData" : "Massage crânien"
                            }, 
                            {
                                "_id" : "5f55dc29693b511a8a7b8d2e",
                                "valueChildData" : "Massage de tout le corps"
                            }
                        ]
                    }
                ]
            }
        ],
        "inputTag" : "dropdown",
        "createdAt" : "2020-09-07T07:07:21.188Z",
        "updatedAt" : "2020-09-07T07:07:21.188Z"
    },
    // {
    //     "_id" : 16,
    //     "status" : "Active",
    //     "language" : [ 
    //         {
    //             "langCode" : "en",
    //             "_id" : "5f50e7956f7f897193b26a31",
    //             "name" : "Fuel",
    //             "values" : [ 
    //                 {
    //                     "_id" : "5f50e7956f7f897193b26a32",
    //                     "valueChild" : [ 
    //                         {
    //                             "_id" : "5f50e7956f7f897193b26a35",
    //                             "valueChildData" : "diesel"
    //                         }, 
    //                         {
    //                             "_id" : "5f50e7956f7f897193b26a34",
    //                             "valueChildData" : "petrol"
    //                         }, 
    //                         {
    //                             "_id" : "5f50e7956f7f897193b26a33",
    //                             "valueChildData" : "gas"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ],
    //     "inputTag" : "dropdown",
    //     "createdAt" : "2020-09-03T12:54:45.433Z",
    //     "updatedAt" : "2020-09-03T12:54:45.433Z",
    //     "__v" : 0
    // }
];

module.exports = { filterSeed };