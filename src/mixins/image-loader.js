// USED BY TAMIAT CMS

import firebase from 'firebase'
import { mediaRef } from '@/firebase_config'

export default {
  methods: {
    // upload image file
    uploadImage (e) {
      let file = e.target.files[0]
      let storageRef = firebase.storage().ref('images/' + file.name)

      storageRef.put(file).then((snapshot) => {
        console.log('Image uploaded')
        mediaRef.once('value')
          .then(function (media) {
            const existingEntry = Object.values(media.val()).find(e => e.path === snapshot.ref.fullPath)
            if (existingEntry) {
              console.log(existingEntry)
              this.insertImage(existingEntry.src)
            } else {
              mediaRef.push({
                src: snapshot.downloadURL,
                path: snapshot.ref.fullPath,
                name: snapshot.metadata.name
              })
              this.insertImage(snapshot.downloadURL)
            }
          })
      })
    },
    // insert the uploaded image as a DOM node in the editor
    insertImage (url) {
      let img = document.createElement('img')
      img.src = url
      document.getElementsByClassName('ql-editor')[0].appendChild(img)
    }
  }
}
