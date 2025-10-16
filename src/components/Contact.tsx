import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Define types for form data and status message
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.includes('@')) return 'Please enter a valid email';
    if (!formData.subject.trim()) return 'Subject is required';
    if (formData.message.trim().length < 10) return 'Message must be at least 10 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setStatusMessage({ type: 'error', text: error });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    setIsSubmitting(true);
    
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'jindal10dhruv@gmail.com'
          }
        })
      });

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Message sent successfully! I\'ll get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to send message. Please try again or email me directly.' });
      console.error('EmailJS Error:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'jindal10dhruv@gmail.com',
      href: 'mailto:jindal10dhruv@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9876592017',
      href: 'tel:+919876592017'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Chandigarh, India',
      href: '#'
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/dhruvjindal007', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/dhruv-jindal-322408294', label: 'LinkedIn' },
  ];

  return (
    <section id="contact" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={`
            mb-6 text-4xl font-bold text-transparent md:text-5xl bg-clip-text bg-gradient-to-r
            ${isDark 
              ? 'from-cyan-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
            }
          `}>
            Let's Work Together
          </h2>
          <div className={`w-20 h-1 mx-auto rounded ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`} />
          <p className={`max-w-3xl mx-auto mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Contact Form */}
          <div className={`
            p-8 border rounded-2xl backdrop-blur-sm
            ${isDark 
              ? 'bg-gray-800/50 border-cyan-500/20' 
              : 'bg-gray-50 border-gray-200'
            }
          `}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative">
                  <label htmlFor="name" className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                      ${isDark 
                        ? 'bg-gray-900/50 border-gray-600 text-white focus:border-cyan-400' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }
                      focus:outline-none
                      ${focusedField === 'name' ? 'scale-105 shadow-lg' : ''}
                    `}
                    style={{
                      boxShadow: focusedField === 'name' 
                        ? isDark 
                          ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
                          : '0 0 0 3px rgba(59, 130, 246, 0.1)'
                        : 'none'
                    }}
                    placeholder="Your Name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`
                      w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                      ${isDark 
                        ? 'bg-gray-900/50 border-gray-600 text-white focus:border-cyan-400' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }
                      focus:outline-none
                      ${focusedField === 'email' ? 'scale-105 shadow-lg' : ''}
                    `}
                    style={{
                      boxShadow: focusedField === 'email' 
                        ? isDark 
                          ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
                          : '0 0 0 3px rgba(59, 130, 246, 0.1)'
                        : 'none'
                    }}
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="subject" className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-600 text-white focus:border-cyan-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }
                    focus:outline-none
                    ${focusedField === 'subject' ? 'scale-105 shadow-lg' : ''}
                  `}
                  style={{
                    boxShadow: focusedField === 'subject' 
                      ? isDark 
                        ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
                        : '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      : 'none'
                  }}
                  placeholder="What's this about?"
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative">
                <label htmlFor="message" className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={6}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 resize-none
                    ${isDark 
                      ? 'bg-gray-900/50 border-gray-600 text-white focus:border-cyan-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }
                    focus:outline-none
                    ${focusedField === 'message' ? 'scale-105 shadow-lg' : ''}
                  `}
                  style={{
                    boxShadow: focusedField === 'message' 
                      ? isDark 
                        ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
                        : '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      : 'none'
                  }}
                  placeholder="Tell me about your project..."
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                  shadow-lg transform hover:scale-105 active:scale-95
                  flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${isDark 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400'
                  }
                `}
                style={{
                  boxShadow: !isSubmitting 
                    ? isDark 
                      ? '0 10px 30px rgba(0, 255, 255, 0.3)' 
                      : '0 10px 30px rgba(59, 130, 246, 0.3)'
                    : 'none'
                }}
              >
                <Send size={20} className={isSubmitting ? 'animate-pulse' : ''} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {statusMessage && (
                <div
                  className={`p-4 rounded-lg border ${
                    statusMessage.type === 'success'
                      ? isDark 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : isDark
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-red-50 text-red-700 border-red-200'
                  } animate-pulse`}
                >
                  {statusMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Get In Touch
              </h3>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                I'm always interested in hearing about new opportunities and exciting projects. 
                Whether you're a company looking to hire, or you're a fellow developer wanting to collaborate, 
                I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className={`
                    flex items-center gap-4 p-4 transition-all duration-300 border rounded-lg backdrop-blur-sm group hover:translate-x-2
                    ${isDark 
                      ? 'bg-gray-800/50 border-cyan-500/20 hover:bg-gray-800 hover:border-cyan-500/40' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }
                  `}
                >
                  <info.icon className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {info.label}
                    </div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {info.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div>
              <h4 className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Follow Me
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`
                      p-3 transition-all duration-300 border rounded-full hover:scale-110 hover:rotate-6
                      ${isDark 
                        ? 'bg-gray-800 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 border-cyan-500/20' 
                        : 'bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white border-gray-200'
                      }
                    `}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;