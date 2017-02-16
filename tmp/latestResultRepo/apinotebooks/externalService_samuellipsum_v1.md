---
id: externalService_samuellipsum_v1
title: 'Perform Simple CRUD Operations'
type: 'Tutorial'
service: 'Samuel L Ipsum'
interactive: true
order: 40
---

### Get access token

To perform any operations with specific service, you always need an access token. For this purpose create an API Client for oAuth2 service.

```javascript
API.createClient('oAuth2Service',
'https://devportal.yaas.io/services/oauth2/b1/api.raml');
```

Now get the token:

```javascript
AccessToken = oAuth2Service.token.post({
  'client_id' : 'en7kp4cbjgA2TuuihU3MxCEShMx5xaEF',
  'client_secret':'63gNfrpSnQWKQXEO',
  'grant_type' : 'client_credentials',
    'token_type': 'Bearer',
  'scope': 'hybris.tenant hybris.document_manage hybris.document_view'
});
```

To make calls simpler and code cleaner, assign Id of returned object to a variable.

```javascript
access_token = AccessToken.body.access_token;
```

### Create API client for Document service


```javascript
API.createClient('documentService',
'https://devportal.yaas.io/services/document/b2/api.raml');
```

### Create a simple object


```javascript
comic_obj = documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').post({
'kind': 'History',
'name': 'Thorgal'
}, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

To make calls simpler and code cleaner, assign Id of returned object to a variable.


```javascript
id = comic_obj.body.id;
```

### Retrieve object created with the previous step


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).get(null, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

### Update an object with additional information

Perform a partial update on the object:

```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).put({
 'title': 'Child of the Stars'
}, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
  },
  query: {
  	'partial' : true
  }
})
```

### Retrieve the same object to ensure that proper information is updated


Get the object to make sure that it was updated. You can be sure it was as the **modifiedAt** date is also updated.


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).get(null, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

### Update entire object with new information

Now perform full update of the object:

```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).put({
  'name': 'Thorgal',
  'title': 'The Brand of the Exiles',
  'kind': 'History'
}, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
  }
})
```

### Retrieve the same object to ensure proper information is replaced


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).get(null, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

### Remove a single attribute from an object


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).attributeName('name').delete(null, {
	headers: {
   'Authorization': 'Bearer ' + access_token,
  }
})
```

### Remove an Entire Object


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).delete(null, {
	headers: {
   'Authorization': 'Bearer ' + access_token,
  }
})
```

### Retrieve a deleted object to ensure it is really deleted


```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId(id).get(null, {
  headers: {
    'Authorization': 'Bearer ' + access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

### Create a simple object with the custom ID



```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId('sampleId').post({
"kind": "History",
"name": "Thorgal"
}, {
  headers: {
    'Authorization': 'Bearer ' + AccessToken.body.access_token,
    'Content-type' : 'application/json'
           }
		}
  )
```

```javascript
documentService.tenant('itutorials').client('hybris.itutorials').data.type('comic').dataId('sampleId').delete(null, {
	headers: {
   'Authorization': 'Bearer ' + access_token,
  }
})
```