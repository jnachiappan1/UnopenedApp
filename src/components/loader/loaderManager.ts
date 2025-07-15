// this is a simple class that will allow us to register and unregister the ToastMessage component
const LoaderManager = {
  instanceOfToast: null,

  register(instance: any) {
    this.instanceOfToast = instance;
  },
  unregister() {
    if (this.instanceOfToast) {
      this.instanceOfToast = null;
    }
  },
  getCurrent() {
    return this.instanceOfToast;
  },
};

export default LoaderManager;
