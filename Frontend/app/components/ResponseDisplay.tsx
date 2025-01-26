'use client'
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaInstagram, FaYoutube, FaUser, FaImage, FaHeart, 
         FaComment, FaPlay, FaMusic, FaCalendar, FaHashtag, FaVideo } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';

interface ResponseDisplayProps {
  data: any;
  onClose: () => void;
}

export default function ResponseDisplay({ data, onClose }: ResponseDisplayProps) {
  const getPlatformIcon = () => {
    switch (data.platform) {
      case 'instagram': return <FaInstagram className="text-pink-500" size={30} />;
      case 'youtube': return <FaYoutube className="text-red-500" size={30} />;
      default: return null;
    }
  };

  const renderProfileImage = (url: string) => {
    if (!url || url === "N/A") return null;
    
    // Clean up the URL and ensure it's a valid URL
    const cleanUrl = url.replace(/\\/g, '').replace(/^"(.+)"$/, '$1');
    
    const [imgError, setImgError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    if (imgError) {
      return (
        <motion.div
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center"
          whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.4)" }}
        >
          <FaUser className="text-white/50" size={40} />
        </motion.div>
      );
    }

    return (
      <motion.div
        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl"
        whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.4)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"/>
          </div>
        )}
        <Image
          src={cleanUrl}
          alt="Profile"
          fill
          className={`object-cover z-10 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          unoptimized
          onError={() => setImgError(true)}
          onLoad={() => setIsLoading(false)}
          sizes="128px"
          priority
        />
      </motion.div>
    );
  };

  const renderBannerImage = (url: string) => {
    if (!url || url === "N/A") return null;

    const [imgError, setImgError] = useState(false);
    const cleanUrl = url.replace(/\\/g, '').replace(/^"(.+)"$/, '$1');

    if (imgError) {
      return (
        <motion.div
          className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
        >
          <FaImage className="text-white/30" size={48} />
        </motion.div>
      );
    }

    return (
      <motion.div
        className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg"
        whileHover={{ scale: 1.02 }}
      >
        <Image
          src={cleanUrl}
          alt="Banner"
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </motion.div>
    );
  };

  const formatMetricValue = (value: any) => {
    if (!value || value === "N/A") return "0";
    return typeof value === 'object' ? value.text || value.count || JSON.stringify(value) : value;
  };

  const renderMetric = (icon: React.ReactNode, value: any, label: string) => {
    const formattedValue = formatMetricValue(value);
    if (!formattedValue) return null;

    return (
      <motion.div
        className="flex items-center gap-3 bg-white/5 p-4 rounded-xl"
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="p-2 bg-white/10 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-white font-bold">{formattedValue}</p>
          <p className="text-white/60 text-sm">{label}</p>
        </div>
      </motion.div>
    );
  };

  const renderYoutubeContent = (content: any) => {
    switch (content.type) {
      case 'youtube_profile':
        return (
          <div className="space-y-8">
            {/* Channel Header */}
            <div className="flex items-center gap-4">
              <FaYoutube className="text-red-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">{content.channel_name}</h2>
                <p className="text-white/60">YouTube Channel</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Visual Elements */}
              <motion.div className="space-y-6">
                {renderProfileImage(content.profile_picture)}
                {renderBannerImage(content.banner_image)}
              </motion.div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderMetric(
                  <FaUser className="text-red-400" size={20} />,
                  content.subscribers,
                  "Subscribers"
                )}
                {renderMetric(
                  <FaVideo className="text-blue-400" size={20} />,
                  content.total_videos,
                  "Total Videos"
                )}
              </div>
            </div>

            {/* Description */}
            {content.description && (
              <motion.div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white/80 text-lg mb-2">Channel Description</h3>
                <p className="text-white/90 whitespace-pre-wrap">{content.description}</p>
              </motion.div>
            )}
          </div>
        );

      case 'youtube_video':
        return (
          <div className="space-y-8">
            {/* Video Header */}
            <div className="flex items-center gap-4">
              <FaYoutube className="text-red-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">Video</h2>
                <p className="text-white/60">ID: {content.video_id}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Author Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {content.channel_picture && renderProfileImage(content.channel_picture)}
                  <div>
                    <h3 className="text-xl font-bold text-white">{content.author?.name}</h3>
                    <p className="text-white/60">{content.subscriber_count} subscribers</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderMetric(
                  <FaHeart className="text-red-400" size={20} />,
                  content.likes,
                  "Likes"
                )}
                {renderMetric(
                  <FaPlay className="text-blue-400" size={20} />,
                  content.views,
                  "Views"
                )}
              </div>
            </div>

            {/* Description and Additional Info */}
            <div className="space-y-4">
              {content.description && (
                <motion.div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-white/80 text-lg mb-2">Description</h3>
                  <p className="text-white/90 whitespace-pre-wrap">{content.description}</p>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.posted && (
                  <motion.div className="bg-white/5 p-4 rounded-xl">
                    <FaCalendar className="text-white/60 mb-2" />
                    <span className="text-white/80">Posted: {content.posted}</span>
                  </motion.div>
                )}
                
                {content.hashtags?.length > 0 && (
                  <motion.div className="bg-white/5 p-4 rounded-xl">
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag: string, index: number) => (
                        <span key={index} className="text-blue-400">#{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 'youtube_shorts':
        return (
          <div className="space-y-8">
            {/* Shorts Header */}
            <div className="flex items-center gap-4">
              <FaYoutube className="text-red-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">YouTube Shorts</h2>
                <p className="text-white/60">ID: {content.shorts_id}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Author Info */}
              <div className="space-y-4">
                {content.author && typeof content.author === 'object' && (
                  <div className="flex items-center gap-4">
                    {content.author.profile_picture && renderProfileImage(content.author.profile_picture)}
                    <div>
                      <h3 className="text-xl font-bold text-white">{content.author.name}</h3>
                      <a href={content.author.channel_url} 
                         className="text-blue-400 hover:underline"
                         target="_blank"
                         rel="noopener noreferrer">
                        View Channel
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderMetric(
                  <FaHeart className="text-red-400" size={20} />,
                  content.likes,
                  "Likes"
                )}
                {renderMetric(
                  <FaComment className="text-yellow-400" size={20} />,
                  content.comments,
                  "Comments"
                )}
              </div>
            </div>

            {/* Description */}
            {content.description && (
              <motion.div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white/80 text-lg mb-2">Description</h3>
                <p className="text-white/90 whitespace-pre-wrap">{content.description}</p>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderInstagramContent = (content: any) => {
    switch (content.type) {
      case 'story':
        return (
          <div className="space-y-8">
            {/* Story Header */}
            <div className="flex items-center gap-4">
              <FaInstagram className="text-pink-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">Instagram Story</h2>
                <p className="text-white/60">@{content.author_info}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Profile Picture */}
              <motion.div className="flex flex-col items-center gap-4">
                {renderProfileImage(content.profile_image)}
                <h3 className="text-xl font-bold text-white">@{content.author_info}</h3>
              </motion.div>

              {/* Right Column - Metadata */}
              <div className="space-y-4">
                {content.metadata && (
                  <motion.div 
                    className="bg-white/5 rounded-xl p-6"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h3 className="text-white/80 text-lg mb-4">Account Information</h3>
                    <div className="space-y-3">
                      {content.metadata.date_joined && (
                        <div className="flex items-center gap-3">
                          <FaCalendar className="text-purple-400" size={16} />
                          <p className="text-white/90">
                            Joined: {content.metadata.date_joined}
                          </p>
                        </div>
                      )}
                      {content.metadata.account_based && (
                        <div className="flex items-center gap-3">
                          <FaUser className="text-blue-400" size={16} />
                          <p className="text-white/90">
                            Based in: {content.metadata.account_based}
                          </p>
                        </div>
                      )}
                      {content.metadata.verified_on && (
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="text-green-400"
                            whileHover={{ scale: 1.1 }}
                          >
                            ✓
                          </motion.div>
                          <p className="text-white/90">
                            Verified: {content.metadata.verified_on}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <FaInstagram className="text-pink-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">{content.name}</h2>
                <p className="text-white/60">Instagram Profile</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Profile Picture */}
              <motion.div className="flex flex-col items-center gap-4">
                {renderProfileImage(content.profile_picture)}
              </motion.div>

              {/* Right Column - Stats */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetric(
                  <FaUser className="text-blue-400" size={20} />,
                  content.followers,
                  "Followers"
                )}
                {renderMetric(
                  <FaUser className="text-green-400" size={20} />,
                  content.following,
                  "Following"
                )}
                {renderMetric(
                  <FaImage className="text-pink-400" size={20} />,
                  content.posts_count,
                  "Posts"
                )}
              </div>
            </div>

            {/* Bio Section */}
            {content.bio && (
              <motion.div 
                className="bg-white/5 rounded-xl p-6"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-white/80 text-lg mb-2">Bio</h3>
                <p className="text-white/90 whitespace-pre-wrap">{content.bio}</p>
              </motion.div>
            )}
          </div>
        );

      case 'reels':
        return (
          <div className="space-y-8">
            {/* Reels Header */}
            <div className="flex items-center gap-4">
              <FaInstagram className="text-pink-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">Instagram Reel</h2>
                <p className="text-white/60">ID: {content.id}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Author Info */}
              {content.author && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {content.author.profile_pic && renderProfileImage(content.author.profile_pic)}
                    <div>
                      <h3 className="text-xl font-bold text-white">{content.author.username}</h3>
                      <a href={content.author.profile_url} 
                         className="text-blue-400 hover:underline"
                         target="_blank"
                         rel="noopener noreferrer">
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetric(
                  <FaHeart className="text-red-400" size={20} />,
                  content.likes,
                  "Likes"
                )}
                {renderMetric(
                  <FaComment className="text-yellow-400" size={20} />,
                  content.comments,
                  "Comments"
                )}
                {renderMetric(
                  <FaPlay className="text-purple-400" size={20} />,
                  content.views,
                  "Views"
                )}
                {content.music && renderMetric(
                  <FaMusic className="text-green-400" size={20} />,
                  content.music,
                  "Music"
                )}
              </div>
            </div>

            {/* Caption */}
            {content.caption && (
              <motion.div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white/80 text-lg mb-2">Caption</h3>
                <p className="text-white/90 whitespace-pre-wrap">{content.caption}</p>
              </motion.div>
            )}
          </div>
        );

      case 'post':
        return (
          <div className="space-y-8">
            {/* Post Header */}
            <div className="flex items-center gap-4">
              <FaInstagram className="text-pink-500" size={40} />
              <div>
                <h2 className="text-3xl font-bold text-white">Instagram Post</h2>
                {content.author?.username && (
                  <p className="text-white/60">by @{content.author.username}</p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Author Info */}
              {content.author && (
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      <a href={content.author.profile_url}
                         className="text-blue-400 hover:underline"
                         target="_blank"
                         rel="noopener noreferrer">
                        @{content.author.username}
                      </a>
                    </h3>
                  </div>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetric(
                  <FaHeart className="text-red-400" size={20} />,
                  content.likes,
                  "Likes"
                )}
                {renderMetric(
                  <FaComment className="text-yellow-400" size={20} />,
                  content.comments,
                  "Comments"
                )}
              </div>
            </div>

            {/* Caption and Date */}
            <div className="space-y-4">
              {content.caption && (
                <motion.div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-white/80 text-lg mb-2">Caption</h3>
                  <p className="text-white/90 whitespace-pre-wrap">{content.caption}</p>
                </motion.div>
              )}
              
              {content.upload_date && (
                <motion.div className="bg-white/5 p-4 rounded-xl">
                  <FaCalendar className="text-white/60 mb-2" />
                  <p className="text-white/80">
                    Posted: {content.upload_date.text}
                    <br />
                    <span className="text-white/60 text-sm">
                      {content.upload_date.title}
                    </span>
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    const content = data.data;
    if (data.platform === 'youtube') {
      return renderYoutubeContent(content);
    } else if (data.platform === 'instagram') {
      return renderInstagramContent(content);
    }
    console.log("Rendering content:", content); // Debug log

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {getPlatformIcon()}
          <div>
            <h2 className="text-3xl font-bold text-white">
              {content.name || content.channel_name || content.author?.name || "Profile"}
            </h2>
            <p className="text-white/60">
              {data.platform} {content.type}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Visual Elements */}
          <motion.div className="space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4">
              {renderProfileImage(content.profile_picture || content.channel_picture || 
                               content.author?.profile_picture)}
              {renderBannerImage(content.banner_image)}
            </div>
          </motion.div>

          {/* Right Column - Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.followers && renderMetric(
              <FaUser className="text-blue-400" size={20} />,
              content.followers,
              "Followers"
            )}
            {content.following && renderMetric(
              <FaUser className="text-green-400" size={20} />,
              content.following,
              "Following"
            )}
            {content.likes && renderMetric(
              <FaHeart className="text-red-400" size={20} />,
              content.likes,
              "Likes"
            )}
            {content.views && renderMetric(
              <FaPlay className="text-purple-400" size={20} />,
              content.views,
              "Views"
            )}
            {content.comments && renderMetric(
              <FaComment className="text-yellow-400" size={20} />,
              content.comments,
              "Comments"
            )}
            {content.posts_count && renderMetric(
              <FaImage className="text-pink-400" size={20} />,
              content.posts_count,
              "Posts"
            )}
            {content.subscriber_count && renderMetric(
              <FaUser className="text-red-400" size={20} />,
              content.subscriber_count,
              "Subscribers"
            )}
          </div>
        </div>

        {/* Description/Bio Section */}
        {(content.bio || content.description || content.caption) && (
          <motion.div
            className="bg-white/5 rounded-xl p-6"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-white/80 text-lg mb-2">
              {content.bio ? "Bio" : content.description ? "Description" : "Caption"}
            </h3>
            <p className="text-white/90 whitespace-pre-wrap">
              {content.bio || content.description || content.caption}
            </p>
          </motion.div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Date */}
          {content.upload_date && (
            <motion.div
              className="bg-white/5 p-4 rounded-xl flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <FaCalendar className="text-white/60" />
              <span className="text-white/80">
                Posted: {content.upload_date.text}
              </span>
            </motion.div>
          )}

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <motion.div
              className="bg-white/5 p-4 rounded-xl flex flex-wrap gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <FaHashtag className="text-white/60" />
              {content.hashtags.map((tag: string, index: number) => (
                <span key={index} className="text-blue-400">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex items-center justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl p-6 max-w-3xl w-full backdrop-blur-lg border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <FaTimes size={24} />
          </motion.button>

          {renderContent()}
        </motion.div>

        {/* Background animation */}
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.1) 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
