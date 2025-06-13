'use client';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-center">
        <div className="text-5xl mb-4 group-hover:animate-bounce">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
          {title}
        </h3>
        <p className="text-blue-200 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
    </div>
  );
};

interface FeaturesProps {
  dictionary: any;
}

const Features = ({ dictionary }: FeaturesProps) => {
  const features = [
    {
      icon: "🎯",
      title: dictionary.interactive_lessons || "Інтерактивні уроки",
      description: dictionary.interactive_lessons_desc || "Захоплюючі уроки з інтерактивними елементами та миттєвим зворотним зв'язком"
    },
    {
      icon: "📊",
      title: dictionary.progress_tracking || "Відстеження прогресу",
      description: dictionary.progress_tracking_desc || "Детальна аналітика успішності та персональні рекомендації для покращення"
    },
    {
      icon: "🎓",
      title: dictionary.expert_teachers || "Досвідчені викладачі",
      description: dictionary.expert_teachers_desc || "Професійні педагоги з багаторічним досвідом викладання фізики та математики"
    },
    {
      icon: "💻",
      title: dictionary.modern_platform || "Сучасна платформа",
      description: dictionary.modern_platform_desc || "Зручний інтерфейс, адаптивний дизайн та доступ з будь-якого пристрою"
    },    {
      icon: "🏆",
      title: dictionary.achievements || "Досягнення",
      description: dictionary.achievements_system_desc || "Система нагород та сертифікатів для мотивації та визнання успіхів"
    },
    {
      icon: "🌍",
      title: dictionary.global_access || "Глобальний доступ",
      description: dictionary.global_access_desc || "Навчайтесь де завгодно та коли завгодно з підтримкою різних мов"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default Features;
