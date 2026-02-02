# Maulana Abdurrofik Portfolio Website

A modern, responsive portfolio website built with Node.js, Express, and MongoDB, featuring an admin panel for easy content management.

## Features

- 🌟 **Modern Design**: Clean, professional design with dark mode support
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🎨 **Dark Mode**: Toggle between light and dark themes
- 👨‍💼 **Admin Panel**: Secure admin dashboard for managing portfolio content
- 📝 **CRUD Operations**: Add, edit, and delete portfolio projects
- 🖼️ **Image Upload**: Support for project images and avatars
- 🏷️ **Categories**: Organize projects by categories (Web, Mobile, Design, etc.)
- ⭐ **Featured Projects**: Highlight important projects
- 🔐 **Secure Authentication**: Admin login system
- 📊 **Dashboard**: Overview of portfolio statistics
- 🚀 **SEO Optimized**: Meta tags and semantic HTML
- ⚡ **Performance**: Optimized for speed with lazy loading

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, HTML5, CSS3, JavaScript
- **Authentication**: Express Session
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## Installation

### Prerequisites

- Node.js 16.0 or higher
- MongoDB (local or cloud instance)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maulanaabdurrofik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   SESSION_SECRET=your-super-secret-session-key
   ADMIN_EMAIL=admin@maulanaabdurrofik.id
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - Or use MongoDB Atlas for cloud database

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Project Structure

```
maulanaabdurrofik/
├── models/                 # MongoDB models
│   ├── Portfolio.js       # Portfolio project model
│   └── Profile.js         # User profile model
├── routes/                # Express routes
│   ├── index.js          # Main website routes
│   ├── admin.js          # Admin panel routes
│   └── api.js            # API routes
├── views/                 # EJS templates
│   ├── partials/         # Reusable components
│   │   ├── header.ejs    # Header component
│   │   └── footer.ejs    # Footer component
│   ├── admin/            # Admin panel templates
│   │   ├── login.ejs     # Admin login
│   │   └── dashboard.ejs # Admin dashboard
│   └── index.ejs         # Homepage
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   │   └── style.css     # Main stylesheet
│   ├── js/               # JavaScript files
│   │   └── main.js       # Main JavaScript
│   ├── images/           # Image assets
│   └── uploads/          # Uploaded files
├── uploads/              # File upload directory
├── .env.example          # Environment variables template
├── .htaccess             # Apache configuration for Hostinger
├── package.json          # Node.js dependencies
├── server.js             # Main application file
└── README.md             # This file
```

## Admin Panel Features

### Dashboard
- Overview statistics
- Recent projects list
- Quick access to all features

### Portfolio Management
- **View All**: List all portfolio projects
- **Add New**: Create new portfolio projects
- **Edit**: Update existing projects
- **Delete**: Remove projects
- **Image Upload**: Add project images
- **Categories**: Organize by categories
- **Featured**: Mark projects as featured

### Profile Management
- Update personal information
- Manage social media links
- Upload avatar
- Edit bio and contact details

## Deployment on Hostinger

### Prerequisites for Hostinger

1. **Hostinger Plan**: Premium or Business plan recommended
2. **Node.js Support**: Ensure your plan supports Node.js
3. **MongoDB**: Use MongoDB Atlas (recommended) or check if Hostinger offers MongoDB

### Step-by-Step Deployment

1. **Prepare Your Files**
   - Make sure all files are in your project directory
   - Update `.env` file with production values
   - Test locally one more time

2. **Upload Files to Hostinger**
   - Use File Manager or FTP to upload all files
   - Upload to the root directory or a subdirectory

3. **Set Environment Variables**
   - In Hostinger control panel, set up environment variables
   - Or create a `.env` file with production values

4. **Configure Database**
   - Set up MongoDB Atlas account (free tier available)
   - Create a database and get connection string
   - Update `MONGODB_URI` in your environment variables

5. **Install Dependencies**
   - Access SSH terminal in Hostinger
   - Navigate to your project directory
   - Run: `npm install --production`

6. **Start the Application**
   - Run: `npm start`
   - Or set up a process manager like PM2

7. **Set Up Domain**
   - Point your domain to Hostinger servers
   - Configure SSL certificate (usually automatic)

### Hostinger-Specific Configuration

The `.htaccess` file is already configured for Hostinger:

- **Proxy Setup**: Routes requests to Node.js application
- **Security Headers**: Adds security headers
- **Gzip Compression**: Compresses files for faster loading
- **Caching**: Sets up browser caching for static files

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
SESSION_SECRET=your-production-secret-key
ADMIN_EMAIL=admin@maulanaabdurrofik.id
ADMIN_PASSWORD=your-secure-production-password
```

## Usage

### Adding Portfolio Projects

1. Log in to admin panel: `/admin`
2. Click "Add Portfolio"
3. Fill in project details:
   - Title and description
   - Category (Web, Mobile, Design, Other)
   - Technologies used
   - Project URL and GitHub link
   - Upload project image
   - Mark as featured if needed
4. Click "Save"

### Managing Profile

1. Go to "Profile" in admin panel
2. Update your information:
   - Name and title
   - Bio and contact details
   - Social media links
   - Upload avatar
3. Click "Update Profile"

## Customization

### Styling
- Edit `public/css/style.css` for custom styles
- CSS variables are used for easy theme customization
- Dark mode is automatically handled

### Adding New Categories
1. Edit `models/Portfolio.js`
2. Add new category to the enum array
3. Update the form in admin panel

### Custom Fields
1. Modify the MongoDB model in `models/`
2. Update the corresponding route in `routes/`
3. Update the EJS templates

## Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Security Headers**: Adds security headers via Helmet
- **Session Management**: Secure session handling
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricts file types and sizes

## Performance Optimization

- **Lazy Loading**: Images load as needed
- **Minified Assets**: CSS and JS are optimized
- **Caching**: Browser caching for static files
- **Compression**: Gzip compression enabled
- **CDN Ready**: Easy to integrate with CDN

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MongoDB URI in `.env`
   - Ensure MongoDB is running
   - Check network connectivity

2. **Upload Issues**
   - Ensure `uploads` directory exists and is writable
   - Check file size limits in multer configuration

3. **Session Issues**
   - Clear browser cookies
   - Check SESSION_SECRET in `.env`

### Hostinger Specific

1. **500 Internal Server Error**
   - Check error logs in Hostinger control panel
   - Ensure all dependencies are installed
   - Verify environment variables

2. **Application Not Starting**
   - Check if Node.js is enabled in your plan
   - Verify the start command
   - Check port availability

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review Hostinger documentation
3. Create an issue in the repository (if applicable)

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ by Maulana Abdurrofik**
