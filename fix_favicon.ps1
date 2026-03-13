Add-Type -AssemblyName System.Drawing
$path = 'c:\Users\Mozzy\Documents\projetos\shelter\src\assets\shelter-logo-cut.png'
$dest = 'c:\Users\Mozzy\Documents\projetos\shelter\src\assets\shelter-logo-favicon.png'
$img = [System.Drawing.Image]::FromFile($path)
$size = [math]::Max($img.Width, $img.Height)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$x = [math]::Round(($size - $img.Width) / 2)
$y = [math]::Round(($size - $img.Height) / 2)
$g.DrawImage($img, $x, $y, $img.Width, $img.Height)
$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Host "Favicon generated successfully"
