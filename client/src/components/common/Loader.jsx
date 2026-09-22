const Loader = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loader;
