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
        name: 'ForgeBand',
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
        name: 'Vision Defenders',
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
        name: 'Tactical Shade',
        fullName: 'SUNFORGE Tactical Cap',
        description: 'Tactical shade deployment with integrated sensors',
        price: '$97',
        salePrice: '$48',
        features: [
          'Strategic vitamin D windows in crown design',
          'UPF 50+ scalp protection where needed',
          'Elite Comfort Design to ensure optimal blood circulation',
          'Moisture-wicking performance technology'
        ],
        image: 'https://sunforge.netlify.app/hat-icon.png'
      },
      monitor: {
        name: 'Solar Ring',
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
        name: 'Sun Medallion',
        fullName: 'SUNFORGE Power Chain',
        description: 'More than jewelry - a statement of solar dominance',
        price: '$286',
        salePrice: '$143',
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

    // Create the HTML email template
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Bronze Legion Waitlist</title>
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
        
        .waitlist-badge {
            background: rgba(212, 175, 55, 0.2);
            border: 2px solid #D4AF37;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .waitlist-title {
            color: #D4AF37;
            font-weight: 600;
            font-size: 20px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .waitlist-message {
            color: #FAFAF8;
            font-size: 16px;
            line-height: 1.7;
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
        
        .drop-info {
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .drop-title {
            font-size: 24px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        
        .drop-subtitle {
            color: #888888;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.7;
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
            text-align: left;
        }
        
        .benefit {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            padding: 20px;
        }
        
        .benefit-title {
            color: #D4AF37;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .benefit-text {
            color: #FAFAF8;
            font-size: 14px;
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
            line-height: 1.7;
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
            .drop-info,
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
            
            .benefits-grid {
                grid-template-columns: 1fr;
                gap: 15px;
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
            <h1 class="hero-title">You're In The Bronze Legion</h1>
            <p class="hero-subtitle">Stop waiting. Your transformation equipment is being forged.</p>
        </div>
        
        <!-- Waitlist Confirmation -->
        <div class="waitlist-badge">
            <div class="waitlist-title">🔥 Waitlist Confirmed</div>
            <div class="waitlist-message">
                Thanks for joining the rebellion against pale zombie life. The next SUNFORGE drop is being forged in our solar foundries. When your equipment is ready, you'll get the 50% off code and lifetime app access. Until then, stop poisoning yourself with fluorescent lights and start planning your escape from indoor slavery.
            </div>
        </div>
        
        <!-- Product Showcase -->
        <div class="product-showcase">
            <div class="product-header">
                <div class="product-badge">Your Reserved Equipment</div>
                <h2 class="product-name">${selectedProduct.fullName}</h2>
                <p class="product-description">${selectedProduct.description}</p>
            </div>
            
            <div class="pricing">
                <span class="original-price">${selectedProduct.price}</span>
                <span class="sale-price">${selectedProduct.salePrice}</span>
                <div class="savings">50% Off - Bronze Legion Exclusive</div>
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
        
        <!-- Drop Information -->
        <div class="drop-info">
            <h2 class="drop-title">What Happens Next</h2>
            <p class="drop-subtitle">
                Your ancestors didn't wait for permission to conquer. Neither should you. Here's what you're getting when the drop launches:
            </p>
            
            <div class="benefits-grid">
                <div class="benefit">
                    <div class="benefit-title">🎯 First Access</div>
                    <div class="benefit-text">You're first in line. No fighting pale zombies for equipment.</div>
                </div>
                
                <div class="benefit">
                    <div class="benefit-title">💰 50% Discount</div>
                    <div class="benefit-text">Exclusive Bronze Legion pricing. Your commitment to excellence pays off.</div>
                </div>
                
                <div class="benefit">
                    <div class="benefit-title">📱 Lifetime App</div>
                    <div class="benefit-text">SUNFORGE app with tracking, protocols, and brotherhood access. Forever.</div>
                </div>
                
                <div class="benefit">
                    <div class="benefit-title">🏆 Legion Status</div>
                    <div class="benefit-text">Join 12,847+ men who stopped accepting weakness and started optimizing.</div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                You're getting this because you refused to stay a pale zombie.<br>
                The drop is coming. Your bronze transformation awaits.<br>
                For now, get some real sunlight. Your vitamin D levels are probably tragic.
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
        email: process.env.FROM_EMAIL || 'mitko592@gmail.com',
        name: 'SUNFORGE - Bronze Legion'
      },
      subject: `🔥 You're In The Bronze Legion - ${selectedProduct.name} Reserved`,
      html: htmlEmail,
      // Plain text version for email clients that don't support HTML
      text: `
You're In The Bronze Legion

Stop waiting. Your transformation equipment is being forged.

WAITLIST CONFIRMED:
Thanks for joining the rebellion against pale zombie life. The next SUNFORGE drop is being forged in our solar foundries. When your equipment is ready, you'll get the 50% off code and lifetime app access. Until then, stop poisoning yourself with fluorescent lights and start planning your escape from indoor slavery.

Your Reserved Equipment: ${selectedProduct.fullName}
${selectedProduct.description}

Bronze Legion Pricing:
Original: ${selectedProduct.price}
Your Price: ${selectedProduct.salePrice}
You Save: 50%

What You're Getting:
→ First access to the drop
→ 50% off exclusive pricing  
→ Lifetime SUNFORGE app access
→ Bronze Legion status with 12,847+ optimized men

Equipment Features:
${selectedProduct.features.map(feature => `• ${feature}`).join('\n')}

The drop is coming. Your bronze transformation awaits.
For now, get some real sunlight. Your vitamin D levels are probably tragic.

SUNFORGE - Solar Masculinity Optimization
Stop being a pale zombie.
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
        message: 'Waitlist confirmation email sent successfully',
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