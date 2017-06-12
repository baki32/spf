$username = "buc@ibmke.onmicrosoft.com"
$password = "bEtmen.6074"
$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $(convertto-securestring $Password -asplaintext -force)
Connect-SPOService -Url https://ibmke-admin.sharepoint.com/ -Credential $cred

Set-SPOTenantCdnEnabled -CdnType Public -Confirm:$false
Add-SPOTenantCdnOrigin -OriginUrl /CDN -CdnType Public -Confirm:$false