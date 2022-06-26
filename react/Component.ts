export default function Component<P extends Record<string, any>, T>(
  this: any,
  props: P & ThisType<T & P>,
) {
  this.props = props
}

Component.prototype.isReactComponent = true
