# Hostinger Deployment Guide

This guide will help you deploy your Maulana Abdurrofik portfolio website on Hostinger.

## Prerequisites

### Hostinger Requirements
- **Plan**: Premium or Business hosting plan (recommended)
- **Node.js Support**: Ensure your plan includes Node.js hosting
- **Domain**: maulanaabdurrofik.id (already owned)
- **MongoDB Atlas**: Free tier account (recommended)

### Before You Begin
1. Complete local testing of your website
2. Have all project files ready
3. Set up MongoDB Atlas account

## Step 1: MongoDB Atlas Setup

### Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project
4. Create a free cluster (M0 Sandbox)

### Configure Database Access
1. **Create Database User**:
   - Go to Database Access
   - Add new user with username and password
   - Grant read/write permissions

2. **Whitelist IP Address**:
   - Go to Network Access
   - Add IP address: `0.0.0.0/0` (allows access from anywhere)
   - For production, consider restricting to Hostinger's IP

### Get Connection String
1. Go to Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Note the connection string for later use

## Step 2: Prepare Files for Upload

### Update Environment Variables
1. Create production `.env` file:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
SESSION_SECRET=your-super-secure-production-secret-key-here
ADMIN_EMAIL=admin@maulanaabdurrofik.id
ADMIN_PASSWORD=your-secure-admin-password-here
```

### Final File Structure
Ensure your project has this structure before uploading:
```
maulanaabdurrofik/
├── models/
├── routes/
├── views/
├── public/
├── uploads/
├── .env
├── .htaccess
├── package.json
├── server.js
└── README.md
```

## Step 3: Upload Files to Hostinger

### Method 1: Using Hostinger File Manager
1. Log in to Hostinger control panel
2. Go to File Manager
3. Navigate to your domain's root directory
4. Upload all project files
5. Extract if you uploaded as ZIP

### Method 2: Using FTP/SFTP
1. Use FileZilla or similar FTP client
2. Connect with your Hostinger FTP credentials
3. Upload all files to the public_html directory

## Step 4: Configure Node.js on Hostinger

### Access SSH Terminal
1. Go to Hostinger control panel
2. Find "SSH Access" or "Terminal"
3. Access the command line

### Navigate to Project Directory
```bash
cd public_html
# or your specific directory
```

### Install Dependencies
```bash
npm install --production
```

### Verify Installation
```bash
ls node_modules
# Should show all installed packages
```

## Step 5: Test the Application

### Start the Application
```bash
node server.js
```

### Check if Running
- Open browser: `http://your-domain.com:3000`
- Should see your portfolio website
- Check admin panel: `http://your-domain.com:3000/admin`

### Stop Application
Press `Ctrl + C` to stop

## Step 6: Set Up Process Manager (Recommended)

### Install PM2
```bash
npm install -g pm2
```

### Start Application with PM2
```bash
pm2 start server.js --name "portfolio"
```

### Save PM2 Configuration
```bash
pm2 save
pm2 startup
```

### Common PM2 Commands
```bash
pm2 list              # List running processes
pm2 logs portfolio    # View logs
pm2 restart portfolio # Restart application
pm2 stop portfolio    # Stop application
pm2 delete portfolio  # Remove application
```

## Step 7: Domain Configuration

### Point Domain to Hostinger
1. Go to your domain registrar (where you bought maulanaabdurrofik.id)
2. Update nameservers to Hostinger's nameservers:
   - ns1.hostinger.com
   - ns2.hostinger.com
   - ns3.hostinger.com
   - ns4.hostinger.com

### Wait for Propagation
- DNS changes can take 24-48 hours
- Use tools like whatsmydns.net to check propagation

## Step 8: SSL Certificate

### Enable SSL
1. Go to Hostinger control panel
2. Find SSL/TLS section
3. Enable free Let's Encrypt SSL
4. Force HTTPS redirect

## Step 9: Final Configuration

### Update .htaccess
The `.htaccess` file should route requests to your Node.js app:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### Test Everything
1. **Website**: `https://maulanaabdurrofik.id`
2. **Admin Panel**: `https://maulanaabdurrofik.id/admin`
3. **API Endpoints**: `https://maulanaabdurrofik.id/api/portfolios`

## Troubleshooting

### Common Issues and Solutions

#### 1. Application Won't Start
**Problem**: Server doesn't start or shows errors
**Solution**:
```bash
# Check logs
pm2 logs portfolio

# Check if port is available
netstat -tlnp | grep :3000

# Try starting manually
node server.js
```

#### 2. Database Connection Error
**Problem**: Cannot connect to MongoDB
**Solution**:
- Verify MongoDB Atlas connection string
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions
- Check if MONGODB_URI is correct in .env

#### 3. File Upload Issues
**Problem**: Images won't upload
**Solution**:
```bash
# Create uploads directory
mkdir uploads
chmod 755 uploads
```

#### 4. 500 Internal Server Error
**Problem**: Website shows 500 error
**Solution**:
- Check Hostinger error logs
- Verify all dependencies are installed
- Check .env file configuration
- Ensure Node.js is properly configured

#### 5. Admin Panel Not Accessible
**Problem**: Can't access /admin
**Solution**:
- Check session configuration
- Verify SESSION_SECRET in .env
- Clear browser cookies
- Check if authentication middleware is working

### Performance Optimization

#### Enable Caching
Your `.htaccess` already includes caching rules:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
</IfModule>
```

#### Optimize Images
- Compress images before uploading
- Use WebP format when possible
- Implement lazy loading (already included)

## Security Considerations

### Environment Variables
- Never commit .env file to version control
- Use strong, unique passwords
- Change default admin credentials

### Database Security
- Use strong database password
- Restrict IP access in MongoDB Atlas if possible
- Regular backups

### Application Security
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use HTTPS (already configured)

## Maintenance

### Regular Tasks
1. **Update Dependencies**:
   ```bash
   npm update
   pm2 restart portfolio
   ```

2. **Monitor Logs**:
   ```bash
   pm2 logs portfolio
   ```

3. **Backup Database**:
   - Use MongoDB Atlas automated backups
   - Export data regularly

4. **Monitor Performance**:
   - Check website speed
   - Monitor server resources
   - Check error logs

### Scaling
If your website grows:
1. Consider upgrading to a higher Hostinger plan
2. Implement CDN for static assets
3. Optimize database queries
4. Add caching layer

## Emergency Procedures

### Website Down
1. Check PM2 status: `pm2 list`
2. Restart application: `pm2 restart portfolio`
3. Check logs: `pm2 logs portfolio`
4. Contact Hostinger support if needed

### Database Issues
1. Check MongoDB Atlas status
2. Verify connection string
3. Check network connectivity
4. Restore from backup if necessary

## Contact Support

### Hostinger Support
- Live chat in Hostinger control panel
- Support tickets
- Knowledge base

### MongoDB Atlas Support
- MongoDB Atlas documentation
- Community forums
- Support tickets (paid plans)

---

**Congratulations! Your portfolio website is now live on Hostinger!**

For any issues, refer to this guide or contact support.
