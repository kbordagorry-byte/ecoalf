from PIL import Image


def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if pixel is close to white (background)
        # Assuming background is white-ish (R>200, G>200, B>200)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0)) # Transparent
        else:
            # It's part of the logo (text)
            # Make it White (255, 255, 255) and keep alpha
            new_data.append((255, 255, 255, 255))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed image saved to {output_path}")

try:
    process_logo(
        "/Users/kbordagorry/Documents/ECOLAF TRABAJO/ecoalf/public/images/ecoalf-logo.png",
        "/Users/kbordagorry/Documents/ECOLAF TRABAJO/ecoalf/public/images/ecoalf-logo-processed.png"
    )
except Exception as e:
    print(f"Error: {e}")
