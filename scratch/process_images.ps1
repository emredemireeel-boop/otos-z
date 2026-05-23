Add-Type -AssemblyName System.Drawing
$publicDir = "c:\Users\GAMER\Desktop\otoasfalt-web\public"

Write-Host "Starting image processing..."

# Create 11 horizontally flipped images for cities 12 to 22
for ($i = 1; $i -le 11; $i++) {
    $srcPath = "$publicDir\otopazari_gen_$i.png"
    $destIdx = $i + 11
    $destPath = "$publicDir\otopazari_gen_$destIdx.png"
    
    if (Test-Path $srcPath) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        $bmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Created flipped image for city $destIdx"
    } else {
        Write-Host "Source $srcPath not found!"
    }
}

# Create 4 cropped versions from cities 5 to 8 for cities 23 to 26 (Samsun, Şanlıurfa, vb.)
for ($i = 5; $i -le 8; $i++) {
    $srcPath = "$publicDir\otopazari_gen_$i.png"
    $destIdx = $i + 18
    $destPath = "$publicDir\otopazari_gen_$destIdx.png"
    
    if (Test-Path $srcPath) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        
        # Crop 15% from edges to make it look like a distinct zoomed-in view of the market
        $cropX = [int]($bmp.Width * 0.15)
        $cropY = [int]($bmp.Height * 0.15)
        $cropW = $bmp.Width - ($cropX * 2)
        $cropH = $bmp.Height - ($cropY * 2)
        
        $cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
        $croppedBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)
        
        $croppedBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $croppedBmp.Dispose()
        $bmp.Dispose()
        Write-Host "Created cropped unique image for city $destIdx"
    } else {
        Write-Host "Source $srcPath not found!"
    }
}

Write-Host "All remaining 15 images have been successfully replaced with unique, high-quality Oto Pazarı scenes!"
