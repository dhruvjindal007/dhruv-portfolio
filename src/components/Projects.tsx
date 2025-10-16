import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../types';
import todoImage from './assets/todo.png';
import restaurant from './assets/restaurant.png';
import blog from './assets/blog.png';
import portfolio from './assets/portfolio.png';
import WebSocket from './assets/WebSocket.png';

const Projects: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [filter, setFilter] = useState('all');

  const projects: Project[] = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'Previously designed fully responsive MERN stack portfolio showcasing 5+ live projects with modern design, smooth animations, and optimized performance.',
      image: portfolio,
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      demoUrl: 'https://portfolio-eight-brown-57.vercel.app/',
      githubUrl: 'https://github.com/dhruvjindal007/Portfolio'
    },
    {
      id: 2,
      title: 'To-Do List App',
      description: 'Full-featured CRUD task manager built with Django, featuring secure user authentication, task categorization, and responsive design.',
      image: todoImage,
      tech: ['Django', 'Python', 'SQL', 'Bootstrap'],
      demoUrl: '#',
      githubUrl: 'https://github.com/dhruvjindal007/To_Do_List'
    },
    {
      id: 3,
      title: 'Restaurant Website',
      description: 'Dynamic restaurant platform with Django backend and React frontend, featuring role-based authentication and integrated LLaMA AI API for dish Q&A.',
      image: restaurant,
      tech: ['Django', 'React', 'LLaMA AI', 'MySQL'],
      demoUrl: '#',
      githubUrl: 'https://github.com/dhruvjindal007/Little-Lemon'
    },
    {
      id: 4,
      title: 'Hotel Booking System',
      description: 'Real-time hotel booking system built with Laravel, featuring admin dashboards, booking management, and MySQL database integration.',
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
      demoUrl: '#',
      githubUrl: 'https://github.com/dhruvjindal007/Laravel-Booking-Management-System'
    },
    {
      id: 5,
      title: 'Blogging Platform',
      description: 'Comprehensive blog system with PHP and MySQL, featuring CKEditor integration, Bootstrap 5 styling, and full mobile responsiveness.',
      image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['PHP', 'MySQL', 'Bootstrap', 'CKEditor'],
      demoUrl: blog,
      githubUrl: 'https://github.com/dhruvjindal007/Blogging-platform'
    },
    {
      id: 6,
      title: 'Remote-Controlled Car',
      description: 'Designed and built a remote-controlled car with Arduino Uno, IR/RF modules, and L298N motor driver for wireless control and stability. Upgraded an existing RC car with steel chassis, Johnson motors, Li-ion battery pack, and servo mechanisms, enhancing efficiency, durability, and overall performance.',
      image: 'https://www.theengineerstore.in/cdn/shop/files/Metal-Tank-Robot-Smart-Car-Chassis-Kit-1.jpg?v=1725359358', 
      tech: ['Arduino', 'IR/RF Modules', 'L298N Motor Driver', 'Johnson Motors', 'Li-ion Battery', 'Servo'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 7,
      title: 'Hovercraft',
      description: 'Created a hovercraft capable of navigating multiple terrains. Designed the structure in Fusion 360, fabricated maneuvering fan components with 3D printing, and applied fluid dynamics and control principles to optimize lift, thrust, and stability.',
      image: 'https://i.ytimg.com/vi/mpqYlHTlXtA/sddefault.jpg',
      tech: ['Fusion 360', '3D Printing', 'Fluid Dynamics', 'Control Systems'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 8,
      title: 'Solar Mobile Charger',
      description: 'Built a portable solar-powered charger using a 6V solar panel, MPPT controller, XL6009E1 DC–DC boost converter, and 3.7V Li-ion battery with fuse protection. Delivered stable DC output for off-grid mobile charging and sustainable energy use.',
      image: 'https://quartzcomponents.com/cdn/shop/articles/Solar-Mobile-Charger_750x.jpg?v=1584511007',
      tech: ['Solar Panel', 'MPPT Controller', 'DC–DC Converter', 'Li-ion Battery'],
      demoUrl: '#',
      githubUrl: '#'
    },
    {
      id: 9,
      title: 'Multiplayer Dashboard',
      description: 'WebSocket Multiplayer Dashboard Game: A real-time multiplayer leaderboard built with React and Socket.IO, featuring live score updates, glassmorphism UI, responsive design, and a simple chat system. Players are instantly ranked, and top scores are visually highlighted.',
      image: WebSocket,
      tech: ['React', 'Socket.IO', 'Node.js', 'CSS'],
      demoUrl: '#',
      githubUrl: 'https://github.com/dhruvjindal007/WebSocket_Multiplayer-Dashboard'
    }
  ];

  const filters = ['all', 'React', 'Django', 'PHP', 'Laravel', 'Python'];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.tech.includes(filter));

  return (
    <section id="projects" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6
            ${isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }
          `}>
            Featured Projects
          </h2>
          <div className={`w-20 h-1 mx-auto rounded ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`} />
          <p className={`mt-6 text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Here are some of my recent projects that showcase my skills and creativity.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filterOption) => (
            <motion.button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${filter === filterOption
                  ? isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="inline w-4 h-4 mr-2" />
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  group relative overflow-hidden rounded-2xl
                  ${isDark 
                    ? 'bg-gray-800/50 border border-cyan-500/20' 
                    : 'bg-white border border-gray-200'
                  }
                  backdrop-blur-sm hover:scale-105 transition-all duration-300
                `}
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden">
                  <div className="relative">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Code snippet overlay on hover */}
                    <motion.div
                      className={`
                        absolute inset-0 flex items-center justify-center p-4
                        ${isDark ? 'bg-gray-900/95' : 'bg-white/95'}
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                      `}
                      initial={{ rotateY: 180 }}
                      whileHover={{ rotateY: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`text-xs font-mono ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                        <div className="mb-2 font-bold">Tech Stack:</div>
                        {project.tech.map((tech, i) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            &gt; {tech}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute flex gap-2 transition-opacity duration-300 opacity-0 top-4 right-4 group-hover:opacity-100"
                    // initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.a
                      href={project.demoUrl}
                      className={`
                        p-2 rounded-full
                        ${isDark ? 'bg-cyan-500 hover:bg-cyan-400' : 'bg-blue-500 hover:bg-blue-400'}
                        text-white transition-colors duration-200
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={16} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      className={`
                        p-2 rounded-full
                        ${isDark ? 'bg-purple-500 hover:bg-purple-400' : 'bg-purple-500 hover:bg-purple-400'}
                        text-white transition-colors duration-200
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github size={16} />
                    </motion.a>
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`
                          px-3 py-1 text-xs font-medium rounded-full
                          ${isDark 
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }
                        `}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;