declare class MagicCommentPlugin {
    constructor(options?: {
        dir: string;
    });
    apply(compiler: Compiler): void;
}
export default MagicCommentPlugin;
