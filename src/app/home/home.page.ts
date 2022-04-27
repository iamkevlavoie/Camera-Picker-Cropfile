import { Component } from '@angular/core';
import { Camera, CameraResultType, ImageOptions} from '@capacitor/camera';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  capturedSnapURL;

  croppedpicturepath;

  loaded = false;


 imagePickerOptions: ImagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
};

  constructor(
    private crop:Crop,
    private imagePicker:ImagePicker,
    

  ) {}

  takeaPicture(){
    let options:ImageOptions={
      quality: 100,
      resultType:CameraResultType.DataUrl,
      saveToGallery: true,
    }
    Camera.getPhoto(options).then((result)=>{
      if(result.dataUrl)
      {
      this.capturedSnapURL = result.dataUrl
      }(err)=>{
        alert(JSON.stringify(err))
      }
    })
  }

  chooseImage() {
    this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.cropImage(results[i]);
      }
    }, (err) => {
      alert(err);
    });
  }

  cropImage(imagePath) {
    this.crop.crop(imagePath, { quality: 50 })
      .then(
        newPath => {
          this.showCropped(newPath.split('?')[0]);
        },
        error => {
          alert('Error occurred while cropping the image ' + error);
        }
      );
  }
  async showCropped(ImagePath){
    this.loaded = true;
    const copyPath = ImagePath;
    const splitPath = copyPath.split('/');
    const imageName= splitPath[splitPath.length - 1]; 
    const file_ext = imageName.substr(imageName.lastIndexOf('.') + 1);
    try {
      const base64 = await Filesystem.readFile({ path: ImagePath});
      if (base64) {
        console.log(base64);
        this.croppedpicturepath = 'data:image/' + file_ext + ';base64,' + base64.data;
        this.loaded = false;
        
      } else {
        this.loaded = false;
        console.log('Error in the showCroppedImage File method');
        console.log('Unexpected Error');
        
        
      }
    } catch (error) {
      this.loaded = false;
      console.log('Error in the showCroppedImage File method');
      console.log('Unexpected Error');
      
      
    }
  }
    

  

    // showCropped(ImagePath){
    //   this.loaded = true;
    //   const copiedpath = ImagePath;
    //   const split = copiedpath.split('/');
    //   const name= split[split.length-1]; //
    //   const pathoffile = ImagePath.split(name)[0];
      
  
    //   this.croppedpicturepath = Filesystem.readFile({
    //     path:pathoffile,
    //     directory:Directory.Documents,
        
        
    //   })
    //   alert('data:')
    

  // showCropped(ImagePath){    
  //   this.loaded = true;    
  //   const copiedpath = ImagePath;
  //   const split = copiedpath.split('/');
  //   const name= split[split.length-1]; //
  //   const pathoffile = ImagePath.split(name)[0];
 
    // this.file.readAsDataURL(pathoffile, name).then(base64=>{
    //     this.croppedpicturepath = base64;
    //     this.loaded = false;
  //   },error=>{
  //     alert('Error displaying the image' + error);
  //     this.loaded = false;
  //   });
  // }
  }

