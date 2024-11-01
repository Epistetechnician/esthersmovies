import cv2
import numpy as np
from PIL import Image
import os

def crop_grid_images(input_image_path, output_directory, grid_size=(10, 10)):
    """
    Crops a grid of images into individual images.
    
    Args:
        input_image_path (str): Path to the input image containing the grid
        output_directory (str): Directory to save the cropped images
        grid_size (tuple): Number of rows and columns in the grid (default: 10x10)
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)
    
    # Read the image
    img = cv2.imread('/Users/shaan.s.patel/Desktop/movies/pixelcut-export.png')
    if img is None:
        raise ValueError("Could not read the input image")
    
    # Get image dimensions
    height, width = img.shape[:2]
    
    # Calculate individual poster dimensions
    poster_width = width // grid_size[1]
    poster_height = height // grid_size[0]
    
    # Crop each poster
    count = 1
    for row in range(grid_size[0]):
        for col in range(grid_size[1]):
            # Calculate coordinates
            x1 = col * poster_width
            y1 = row * poster_height
            x2 = x1 + poster_width
            y2 = y1 + poster_height
            
            # Crop the poster
            poster = img[y1:y2, x1:x2]
            
            # Save the cropped image
            output_path = os.path.join(output_directory, f'movie_poster_{count:03d}.jpg')
            cv2.imwrite(output_path, poster)
            count += 1

def main():
    """
    Main function to run the grid cropper.
    """
    try:
        # Get current directory
        current_dir = os.getcwd()
        
        # Define input and output paths
        input_image = 'pixelcut-export.png'  # Change this to your input image name
        output_dir = os.path.join(current_dir, 'cropped_posters')
        
        # Crop the images
        crop_grid_images(input_image, output_dir)
        print(f"Successfully cropped images. Check the '{output_dir}' directory.")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
