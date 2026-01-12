def normalize_persona(persona):
    mapping = {
        "سائح": "tourist",
        "مواطن": "citizen",
        "باحث اكاديمي": "researcher",
        "tourist": "tourist",
        "citizen": "citizen",
        "researcher": "researcher"
    }
    return mapping.get(persona, "citizen")


def normalize_interest(interest):
    mapping = {
        "التاريخ": "history",
        "الاقتصاد": "economy",
        "العادات والتقاليد": "culture",
        "الاستكشاف العام": "general",

        "history": "history",
        "economy": "economy",
        "culture": "culture",
        "general": "general"
    }
    return mapping.get(interest, "general")


def personalize(region, persona, interest):
    persona = normalize_persona(persona)
    interest = normalize_interest(interest)

    
    response = {
        "region": region["name"],
        "persona": persona,
        "interest": {
            "key": interest,
            "label": {
                "history": "التاريخ",
                "economy": "الاقتصاد",
                "culture": "العادات والتقاليد",
                "general": "الاستكشاف العام"
            }.get(interest, "الاستكشاف العام")
        },
        "sources": region["sources"],
        "map_coordinates": region["landmarks"],
        "summary": region["core_story"]["summary"]
    }

    
    highlights = region["dimensions"].get(interest, {}).get("highlights", [])

    
    if persona == "tourist":
        response["title"] = f"مقدّمة سريعة عن {region['name']}"
        response["summary"] += " تتضمن أبرز المعالم والمعلومات التي تهم الزائر للتعرف على المنطقة بسهولة."
        response["highlights"] = highlights[:1]  
        response["experience_style"] = "نظرة عامة مختصرة"
    elif persona == "researcher":
        response["title"] = f"{region['name']} من منظور بحثي"
        response["summary"] += " مع التركيز على التفاصيل التاريخية والاقتصادية والروابط الزمنية بين الأحداث."
        response["highlights"] = highlights  
        response["experience_style"] = "تفصيلية موجهة للباحثين"
    else: # citizen
        response["title"] = f"{region['name']} كما يعرفها أهلها"
        response["summary"] += " مع إبراز الجوانب التي تعكس الطابع المحلي والهوية الثقافية للمكان."
        response["highlights"] = highlights 
        response["experience_style"] = "قريبة من الذاكرة والانتماء"
    return response