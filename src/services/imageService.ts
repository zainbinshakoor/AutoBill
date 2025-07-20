import { 
  launchCamera, 
  launchImageLibrary, 
  ImagePickerResponse,
  MediaType,
  CameraOptions,
  ImageLibraryOptions
} from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';
import { ImageData } from '../types';
import { IMAGE_CONFIG } from '../utils/constants';

// Use the proper types from react-native-image-picker
const cameraOptions: CameraOptions = {
  mediaType: 'photo' as MediaType,
  includeBase64: false,
  maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
  maxWidth: IMAGE_CONFIG.MAX_WIDTH,
  quality: IMAGE_CONFIG.QUALITY,
};

const libraryOptions: ImageLibraryOptions = {
  mediaType: 'photo' as MediaType,
  includeBase64: false,
  maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
  maxWidth: IMAGE_CONFIG.MAX_WIDTH,
  quality: IMAGE_CONFIG.QUALITY,
  selectionLimit: 1,
};

export const imageService = {
  // Show image picker options
  showImagePicker: (): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Select Image',
        'Choose an option to select expense receipt',
        [
          {
            text: 'Camera',
            onPress: () => {
              imageService.openCamera()
                .then(resolve)
                .catch(reject);
            },
          },
          {
            text: 'Gallery',
            onPress: () => {
              imageService.openGallery()
                .then(resolve)
                .catch(reject);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => reject(new Error('User cancelled')),
          },
        ],
        { cancelable: true }
      );
    });
  },

  // Open camera
  openCamera: (): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      launchCamera(cameraOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          reject(new Error('User cancelled camera'));
        } else if (response.errorMessage) {
          reject(new Error(response.errorMessage));
        } else if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          if (!asset.uri) {
            reject(new Error('No image URI received'));
            return;
          }

          resolve({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'camera_image.jpg',
            fileSize: asset.fileSize || 0,
          });
        } else {
          reject(new Error('Failed to capture image'));
        }
      });
    });
  },

  // Open gallery
  openGallery: (): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      launchImageLibrary(libraryOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          reject(new Error('User cancelled gallery'));
        } else if (response.errorMessage) {
          reject(new Error(response.errorMessage));
        } else if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          if (!asset.uri) {
            reject(new Error('No image URI received'));
            return;
          }

          resolve({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'gallery_image.jpg',
            fileSize: asset.fileSize || 0,
          });
        } else {
          reject(new Error('Failed to select image'));
        }
      });
    });
  },

  // Validate image
  validateImage: (imageData: ImageData): boolean => {
    const { fileSize, type, uri } = imageData;
    
    // Check if image exists
    if (!uri) {
      throw new Error('No image selected');
    }

    // Check file size
    if (fileSize && fileSize > IMAGE_CONFIG.MAX_SIZE) {
      const maxSizeMB = Math.round(IMAGE_CONFIG.MAX_SIZE / (1024 * 1024));
      throw new Error(`Image size must be less than ${maxSizeMB}MB`);
    }

    // Check file type
    if (type && !IMAGE_CONFIG.ALLOWED_TYPES.some(allowedType => 
      type.toLowerCase().includes(allowedType.split('/')[1])
    )) {
      throw new Error('Please select a valid image file (JPEG, JPG, or PNG)');
    }

    return true;
  },

  // Get image info
  getImageInfo: (imageData: ImageData): {
    size: string;
    type: string;
    name: string;
  } => {
    return {
      size: imageService.formatFileSize(imageData.fileSize || 0),
      type: imageData.type || 'Unknown',
      name: imageData.fileName || 'Unknown',
    };
  },

  // Compress image (optional - you can implement this if needed)
  compressImage: async (imageUri: string): Promise<string> => {
    try {
      // You can use react-native-image-resizer or similar library for compression
      // npm install react-native-image-resizer
      // const ImageResizer = require('react-native-image-resizer');
      // const resizedImage = await ImageResizer.createResizedImage(
      //   imageUri,
      //   800,
      //   600,
      //   'JPEG',
      //   80
      // );
      // return resizedImage.uri;
      
      // For now, returning the original URI
      return imageUri;
    } catch (error) {
      throw new Error('Failed to compress image');
    }
  },

  // Get image dimensions
  getImageDimensions: (imageUri: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const { Image } = require('react-native');
      Image.getSize(
        imageUri,
        (width: number, height: number) => {
          resolve({ width, height });
        },
        (error: any) => {
          reject(new Error(`Failed to get image dimensions: ${error.message}`));
        }
      );
    });
  },

  // Convert image to base64 (if needed)
  convertToBase64: async (imageUri: string): Promise<string> => {
    try {
      // You would need to install react-native-fs for this
      // npm install react-native-fs
      // const RNFS = require('react-native-fs');
      // const base64 = await RNFS.readFile(imageUri, 'base64');
      // return base64;
      
      throw new Error('Base64 conversion requires react-native-fs. Install with: npm install react-native-fs');
    } catch (error: any) {
      throw new Error(`Failed to convert image to base64: ${error.message}`);
    }
  },

  // Check camera permissions
  checkCameraPermission: async (): Promise<boolean> => {
    try {
      // You would need to install react-native-permissions for this
      // npm install react-native-permissions
      // const { check, PERMISSIONS, RESULTS } = require('react-native-permissions');
      // const permission = Platform.OS === 'ios' 
      //   ? PERMISSIONS.IOS.CAMERA 
      //   : PERMISSIONS.ANDROID.CAMERA;
      // const result = await check(permission);
      // return result === RESULTS.GRANTED;
      
      console.warn('Camera permission check not implemented. Install react-native-permissions for full functionality.');
      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  },

  // Request camera permissions
  requestCameraPermission: async (): Promise<boolean> => {
    try {
      // You would need to install react-native-permissions for this
      // npm install react-native-permissions
      // const { request, PERMISSIONS, RESULTS } = require('react-native-permissions');
      // const permission = Platform.OS === 'ios' 
      //   ? PERMISSIONS.IOS.CAMERA 
      //   : PERMISSIONS.ANDROID.CAMERA;
      // const result = await request(permission);
      // return result === RESULTS.GRANTED;
      
      return await imageService.checkCameraPermission();
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  },

  // Check if image is valid format
  isValidImageFormat: (fileName: string): boolean => {
    const extension = fileName.toLowerCase().split('.').pop();
    const validExtensions = ['jpg', 'jpeg', 'png'];
    return validExtensions.includes(extension || '');
  },

  // Get image file extension
  getImageExtension: (fileName: string): string => {
    return fileName.toLowerCase().split('.').pop() || '';
  },

  // Format file size for display
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Create image thumbnail (placeholder)
  createThumbnail: async (imageUri: string, size: number = 200): Promise<string> => {
    try {
      // This would require a library like react-native-image-resizer
      // npm install react-native-image-resizer
      // const ImageResizer = require('react-native-image-resizer');
      // const thumbnail = await ImageResizer.createResizedImage(
      //   imageUri,
      //   size,
      //   size,
      //   'JPEG',
      //   70
      // );
      // return thumbnail.uri;
      
      console.warn('Thumbnail creation not implemented. Install react-native-image-resizer for this functionality.');
      return imageUri;
    } catch (error) {
      throw new Error('Failed to create thumbnail');
    }
  },

  // Resize image for upload optimization
  optimizeForUpload: async (imageUri: string): Promise<string> => {
    try {
      // This would compress and resize the image for optimal upload
      // You can use react-native-image-resizer for this
      const maxWidth = 1200;
      const maxHeight = 1200;
      const quality = 80;
      
      // For now, return the original URI
      // In production, implement actual resizing:
      // const optimizedImage = await ImageResizer.createResizedImage(
      //   imageUri,
      //   maxWidth,
      //   maxHeight,
      //   'JPEG',
      //   quality
      // );
      // return optimizedImage.uri;
      
      return imageUri;
    } catch (error) {
      throw new Error('Failed to optimize image for upload');
    }
  },
};