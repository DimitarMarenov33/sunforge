// netlify/functions/send-email.js
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { email, product } = JSON.parse(event.body);
    
    // Validate required fields
    if (!email || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and product are required' })
      };
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Product data mapping
    const productData = {
      tracker: {
        name: 'UV Precision Tracker',
        fullName: 'SUNFORGE UV Tracker',
        description: 'Military-grade UV sensors that track every photon hitting your skin',
        price: '$297',
        salePrice: '$148',
        features: [
          'Real-time vitamin D synthesis tracking',
          'Testosterone optimization through precise sun exposure', 
          'Solar-powered - 14 days on God\'s energy',
          'Aerospace titanium - built like your mindset'
        ],
        image: 'https://sunforge.netlify.app/bracelet-icon.png'
      },
      protection: {
        name: 'Elite Vision Protection',
        fullName: 'SUNFORGE Vision Shield',
        description: 'Block the blue light prison while optimizing your circadian rhythm',
        price: '$197',
        salePrice: '$98',
        features: [
          'Blue light assassination - protect your sleep',
          'Circadian rhythm optimization technology',
          'Zero distortion - maximum protection',
          'Photochromic adaptation - smart like you'
        ],
        image: 'https://sunforge.netlify.app/sunglasses-icon.png'
      },
      coverage: {
        name: 'Strategic Solar Coverage',
        fullName: 'SUNFORGE Tactical Cap',
        description: 'Tactical shade deployment with integrated sensors',
        price: '$97',
        salePrice: '$48',
        features: [
          'Strategic vitamin D windows in crown design',
          'UPF 50+ scalp protection where needed',
          'Temperature regulation system',
          'Moisture-wicking performance technology'
        ],
        image: 'https://sunforge.netlify.app/hat-icon.png'
      },
      monitor: {
        name: 'Biometric Power Monitor',
        fullName: 'SUNFORGE Power Monitor',
        description: 'Track your body\'s response to solar optimization',
        price: '$397',
        salePrice: '$198',
        features: [
          'Continuous vitals monitoring with solar charging',
          'Heart rate variability and stress optimization',
          'Sleep quality and recovery analytics',
          'Titanium construction - unbreakable commitment'
        ],
        image: 'https://sunforge.netlify.app/ring-icon.png'
      },
      power: {
        name: 'Solar Power Chain',
        fullName: 'SUNFORGE Power Chain',
        description: 'More than jewelry - a statement of solar dominance',
        price: '$497',
        salePrice: '$248',
        features: [
          'Device charging through solar cell integration',
          'Respiratory and cardiac monitoring system',
          'Core temperature regulation feedback',
          'Magnetic charging ports in titanium links'
        ],
        image: 'https://sunforge.netlify.app/chain-icon.png'
      }
    };

    const selectedProduct = productData[product];
    if (!selectedProduct) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid product selected' })
      };
    }

    // Generate checkout link (you'll replace this with your actual payment processor)
    const checkoutLink = `https://sunforge.netlify.app/checkout?product=${product}&email=${encodeURIComponent(email)}`;

    // Create the HTML email template
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Bronze Legion</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #000000;
            color: #FAFAF8;
        }
        
        .header {
            background: linear-gradient(135deg, #D4AF37 0%, #F4D976 100%);
            padding: 40px 30px;
            text-align: center;
            color: #000;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        
        .header-subtitle {
            font-size: 14px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .hero-section {
            padding: 50px 30px;
            text-align: center;
            background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
        }
        
        .hero-title {
            font-size: 32px;
            font-weight: 300;
            margin-bottom: 20px;
            letter-spacing: -1px;
        }
        
        .hero-subtitle {
            font-size: 18px;
            color: #888888;
            margin-bottom: 30px;
        }
        
        .product-showcase {
            background: #0a0a0a;
            padding: 40px 30px;
            border-top: 2px solid #D4AF37;
            border-bottom: 2px solid #D4AF37;
        }
        
        .product-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .product-badge {
            display: inline-block;
            background: #D4AF37;
            color: #000;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        
        .product-name {
            font-size: 28px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        
        .product-description {
            color: #888888;
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        .pricing {
            text-align: center;
            margin: 30px 0;
        }
        
        .original-price {
            font-size: 18px;
            color: #888888;
            text-decoration: line-through;
            margin-right: 15px;
        }
        
        .sale-price {
            font-size: 36px;
            font-weight: 300;
            color: #D4AF37;
            letter-spacing: -1px;
        }
        
        .savings {
            background: linear-gradient(135deg, #D4AF37 0%, #F4D976 100%);
            color: #000;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 15px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .features-list {
            list-style: none;
            margin: 30px 0;
        }
        
        .features-list li {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .feature-icon {
            width: 24px;
            height: 24px;
            background: #D4AF37;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #000;
            font-weight: 600;
        }
        
        .cta-section {
            padding: 50px 30px;
            text-align: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        }
        
        .cta-title {
            font-size: 24px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        
        .cta-subtitle {
            color: #888888;
            margin-bottom: 30px;
            font-size: 16px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #D4AF37 0%, #F4D976 100%);
            color: #000;
            padding: 18px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }
        
        .urgency {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        
        .urgency-title {
            color: #D4AF37;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .timer {
            font-size: 24px;
            font-weight: 300;
            color: #D4AF37;
            letter-spacing: 2px;
        }
        
        .footer {
            background: #0a0a0a;
            padding: 40px 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-text {
            color: #888888;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            color: #D4AF37;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        
        .unsubscribe {
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
        
        .unsubscribe a {
            color: #888;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                width: 100%;
            }
            
            .hero-section,
            .product-showcase,
            .cta-section,
            .footer {
                padding: 30px 20px;
            }
            
            .hero-title {
                font-size: 24px;
            }
            
            .product-name {
                font-size: 22px;
            }
            
            .sale-price {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">SUNFORGE</div>
            <div class="header-subtitle">Solar Masculinity Optimization</div>
        </div>
        
        <!-- Hero Section -->
        <div class="hero-section">
            <h1 class="hero-title">Welcome to the Bronze Legion</h1>
            <p class="hero-subtitle">Your transformation from pale zombie to bronze god begins now</p>
        </div>
        
        <!-- Product Showcase -->
        <div class="product-showcase">
            <div class="product-header">
                <div class="product-badge">Your Selected Equipment</div>
                <h2 class="product-name">${selectedProduct.fullName}</h2>
                <p class="product-description">${selectedProduct.description}</p>
            </div>
            
            <div class="pricing">
                <span class="original-price">${selectedProduct.price}</span>
                <span class="sale-price">${selectedProduct.salePrice}</span>
                <div class="savings">Save ${parseInt(selectedProduct.price.slice(1)) - parseInt(selectedProduct.salePrice.slice(1))}$ - Bronze Legion Exclusive</div>
            </div>
            
            <ul class="features-list">
                ${selectedProduct.features.map((feature, index) => `
                <li>
                    <div class="feature-icon">⚡</div>
                    <span>${feature}</span>
                </li>
                `).join('')}
            </ul>
        </div>
        
        <!-- Urgency Section -->
        <div class="urgency">
            <div class="urgency-title">⏰ Limited Time - 50% Off Ends Soon</div>
            <div class="timer">47:23:15</div>
            <p style="margin-top: 10px; color: #888; font-size: 14px;">This Bronze Legion pricing expires in less than 48 hours</p>
        </div>
        
        <!-- CTA Section -->
        <div class="cta-section">
            <h2 class="cta-title">Claim Your ${selectedProduct.name}</h2>
            <p class="cta-subtitle">Join 12,847+ men who escaped their fluorescent prison</p>
            <a href="${checkoutLink}" class="cta-button">Secure My Equipment Now</a>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                You're receiving this because you joined the Bronze Legion at SUNFORGE.<br>
                Your ancestors conquered under the sun. Your transformation starts now.
            </p>
            
            <div class="social-links">
                <a href="#">Brotherhood Forum</a>
                <a href="#">Transformation Gallery</a>
                <a href="#">Solar Protocols</a>
            </div>
            
            <div class="unsubscribe">
                <a href="#">Unsubscribe</a> | <a href="#">Update Preferences</a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Email configuration
    const msg = {
      to: email,
      from: {
        email: process.env.FROM_EMAIL || 'forge@sunforge.com',
        name: 'SUNFORGE - Bronze Legion'
      },
      subject: `⚡ Welcome to the Bronze Legion - Your ${selectedProduct.name} Awaits`,
      html: htmlEmail,
      // Plain text version for email clients that don't support HTML
      text: `
Welcome to the Bronze Legion!

Your transformation from pale zombie to bronze god begins now.

You've selected: ${selectedProduct.fullName}
${selectedProduct.description}

Special Bronze Legion Pricing:
Original Price: ${selectedProduct.price}
Your Price: ${selectedProduct.salePrice}
You Save: $${parseInt(selectedProduct.price.slice(1)) - parseInt(selectedProduct.salePrice.slice(1))}

Claim your equipment now: ${checkoutLink}

This 50% off pricing expires in less than 48 hours.

Join 12,847+ men who escaped their fluorescent prison.

Your ancestors conquered under the sun. Your transformation starts now.

SUNFORGE - Solar Masculinity Optimization
      `
    };

    // Send the email
    await sgMail.send(msg);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        product: selectedProduct.name
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};