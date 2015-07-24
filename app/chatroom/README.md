API
========

```
curl -XPOST "/api/v1/room/default/messages" -H "Content-Type: application/json" -d '
{
    "type":"message",
    "value":"Sushi! Yakiniku!",
    "user":{
        "name":"hisyotan",
        "screen_name":"hisyotan",
        "profile_image_url":"/public/img/hisyotan.png"
    }
}'
```
