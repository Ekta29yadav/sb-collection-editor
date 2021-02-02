export const toolbarConfig = {
  headerName: 'Edit Collection',
  title: 'Digital-Textbook Editor',
  buttons: [{
    name: 'Save as draft',
    type: 'saveContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary mr-10',
  },
  {
    name: 'Submit',
    type: 'submitContent',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-primary mr-10',
    slot: `<i class="trash alternate outline icon"></i>`
  },
  {
    name: 'add from library',
    type: 'addFromLibrary',
    buttonType: 'button',
    style: 'sb-btn sb-btn-normal sb-btn-outline-primary mr-10',
  }
  // {
  //   name: 'Add Resource',
  //   type: 'addResource',
  //   buttonType: 'button',
  //   style: 'sb-btn sb-btn-normal sb-btn-primary',
  //   slot: `<i class="trash alternate outline icon"></i>`
  // }
  ]
};

export const PLAYER_CONFIG = {
  "playerConfig": {
    "context": {
      "mode": "play",
      "partner": [],
      "pdata": {
        "id": "sunbird.portal",
        "ver": "1.8.0",
        "pid": "sunbird-portal"
      }
    },
    "config": {
      "showEndPage": false,
      "endPage": [
        {
          "template": "assessment",
          "contentType": [
            "SelfAssess"
          ]
        }
      ],
      "showStartPage": true,
      "host": "",
      "overlay": {
        "showUser": false
      },
      "splash": {
        "text": "",
        "icon": "",
        "bgImage": "assets/icons/splacebackground_1.png",
        "webLink": ""
      },
      "sideMenu": {
        showDownload: true,
        showExit: false,
        showShare: true
      },
      "apislug": "/action",
      "repos": [
        "/sunbird-plugins/renderer"
      ],
      "plugins": [
        {
          "id": "org.sunbird.iframeEvent",
          "ver": 1.0,
          "type": "plugin"
        },
        {
          "id": "org.sunbird.player.endpage",
          "ver": 1.1,
          "type": "plugin"
        }
      ]
    }
  },
  "contentType": {
    "Course": "Course"
  },
  "MIME_TYPE": {
    "collection": "application/vnd.ekstep.content-collection",
    "ecmlContent": "application/vnd.ekstep.ecml-archive",
    "genericMimeType": [
      "application/pdf",
      "video/mp4",
      "video/x-youtube",
      "video/youtube",
      "application/vnd.ekstep.html-archive",
      "application/epub",
      "application/vnd.ekstep.h5p-archive",
      "video/webm",
      "text/x-url"
    ],
    "pdf": "application/pdf",
    "mp4": "video/mp4",
    "youtube": "video/x-youtube",
    "pYoutube": "video/youtube",
    "html": "application/vnd.ekstep.html-archive",
    "ePub": "application/epub",
    "h5p": "application/vnd.ekstep.h5p-archive",
    "webm": "video/webm",
    "xUrl": "text/x-url"
  },
  "playerType": {
    'pdf-player': ['application/pdf'],
    'video-player': ['video/mp4', 'video/webm']
  },
  "baseURL": "/content/preview/preview.html?webview=true",
  "localBaseUrl": "/contentPlayer/preview/preview.html?",
  "cdnUrl": "/content/preview/preview_cdn.html?webview=true"
};






