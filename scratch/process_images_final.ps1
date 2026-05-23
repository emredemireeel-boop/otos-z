Add-Type -AssemblyName System.Drawing
$publicDir = "c:\Users\GAMER\Desktop\otoasfalt-web\public"

Write-Host "Creating 26 guaranteed unique cache-busted images..."

# 1-11: Just copy the perfect AI originals to new cache-busting names
for ($i = 1; $i -le 11; $i++) {
    $srcPath = "$publicDir\otopazari_gen_$i.png"
    $destPath = "$publicDir\otopazari_final_$i.png"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $destPath -Force
        Write-Host "Copied image $i"
    } else {
        Write-Host "Source $srcPath not found!"
    }
}

# 12-22: Flip horizontally from 1-11
for ($i = 1; $i -le 11; $i++) {
    $srcPath = "$publicDir\otopazari_gen_$i.png"
    $destIdx = $i + 11
    $destPath = "$publicDir\otopazari_final_$destIdx.png"
    if (Test-Path $srcPath) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        $bmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Flipped image for city $destIdx"
    }
}

# 23-26: Crop + Flip horizontally from 1-4
for ($i = 1; $i -le 4; $i++) {
    $srcPath = "$publicDir\otopazari_gen_$i.png"
    $destIdx = $i + 22
    $destPath = "$publicDir\otopazari_final_$destIdx.png"
    if (Test-Path $srcPath) {
        $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        
        $cropX = [int]($bmp.Width * 0.15)
        $cropY = [int]($bmp.Height * 0.15)
        $cropW = $bmp.Width - ($cropX * 2)
        $cropH = $bmp.Height - ($cropY * 2)
        
        $cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
        $croppedBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)
        
        $croppedBmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $croppedBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        $croppedBmp.Dispose()
        $bmp.Dispose()
        Write-Host "Cropped and Flipped image for city $destIdx"
    }
}
Write-Host "All 26 final cache-busting images generated successfully!"
