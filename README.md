# Zroom Website

Static website for Zroom.

## Deploy To GitHub Pages

1. Create a new GitHub repository for the website.
2. Upload the contents of this `website/` folder to the repository root.
3. In GitHub, open `Settings > Pages`.
4. Set the source to the main branch root.
5. Keep the custom domain as:

```text
zroomfocus.com
```

## Cloudflare DNS

For GitHub Pages, set these records in Cloudflare:

```text
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153
CNAME www    <your-github-username>.github.io
```

After GitHub Pages verifies the domain, enable HTTPS.

## App Store Connect URLs

Use these URLs after deployment:

```text
Support URL: https://zroomfocus.com
Privacy Policy URL: https://zroomfocus.com/privacy.html
Terms of Use URL: https://zroomfocus.com/terms.html
```

Support email:

```text
support@zroomfocus.com
```
