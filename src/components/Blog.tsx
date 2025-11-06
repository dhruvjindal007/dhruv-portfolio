import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { blogPosts } from './blogData';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2
            className={`
              text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text
              ${isDark
                ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }
            `}
          >
            Latest Blog Posts
          </h2>

          <div
            className={`w-20 h-1 mx-auto rounded ${
              isDark ? 'bg-cyan-400' : 'bg-blue-500'
            }`}
          />

          <p
            className={`mt-6 text-lg max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Sharing insights, tutorials, and thoughts on web development,
            technology trends, and best practices.
          </p>
        </motion.div>

        {/* Blog Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`
                group relative overflow-hidden rounded-2xl backdrop-blur-sm
                ${isDark
                  ? 'bg-gray-900/50 border border-cyan-500/20'
                  : 'bg-white border border-gray-200'
                }
                hover:scale-105 transition-all duration-300
              `}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm">

                  <div className={`flex items-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>

                  <div className={`flex items-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3
                  className={`text-lg font-bold mb-3 leading-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {post.title}
                </h3>

                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {post.excerpt}
                </p>

                {/* Read More */}
                <Link
                  to={`/blog/${post.id}`}
                  className={`
                    flex items-center gap-2 text-sm font-medium transition-colors duration-200
                    ${isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-blue-600 hover:text-blue-500'
                    }
                  `}
                >
                  Read More
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            className={`
              px-8 py-4 rounded-full font-semibold text-lg shadow-lg
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isDark
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400'
              }
            `}
            whileHover={{
              boxShadow: isDark
                ? '0 20px 40px rgba(0, 255, 255, 0.3)'
                : '0 20px 40px rgba(59, 130, 246, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            View All Posts
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;