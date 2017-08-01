## Customization

### Configuration file

You can customize your page in file `customization/config.json` (by default, you can set path to dir contains `config.json` in `chewieConfig.js` - *customization.dirPath*).

JSON Schema for configuration file:

```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "properties": {
        "generalNav": {
            "items": {
                "properties": {
                    "href": {
                        "description": "Link to resource.",
                        "type": "string"
                    },
                    "name": {
                        "description": "Name of resource.",
                        "type": "string"
                    },
                    "id": {
                        "description": "ID of HTML element.",
                        "type": "string"
                    }
                },
                "required": [
                    "href",
                    "name"
                ],
                "type": "object"
            },
            "type": "array"
        }
    },
    "type": "object"
}
```

Example configuration file:

```json
{
  "generalNav": [
    {
      "href": "/",
      "name": "Home"
    },
    {
      "href": "/services/",
      "name": "API Docs"
    }
  ]
}
```

### Landing page

To customize your landing page, you can create file `index.html` in `customization` dir, it will replace default landing page.
