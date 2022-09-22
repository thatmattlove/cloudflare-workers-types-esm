import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

export interface ParseOptions {
  module?: boolean | string;
}

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      if (ts.isClassDeclaration(node)) {
        return ts.factory.updateClassDeclaration(
          node,
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...(node.modifiers ?? [])],
          node.name,
          node.typeParameters,
          node.heritageClauses,
          node.members,
        );
      }
      if (ts.isInterfaceDeclaration(node)) {
        return ts.factory.updateInterfaceDeclaration(
          node,
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...(node.modifiers ?? [])],
          node.name,
          node.typeParameters,
          node.heritageClauses,
          node.members,
        );
      }

      if (ts.isTypeAliasDeclaration(node)) {
        return ts.factory.updateTypeAliasDeclaration(
          node,
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...(node.modifiers ?? [])],
          node.name,
          node.typeParameters,
          node.type,
        );
      }

      if (ts.isFunctionDeclaration(node)) {
        return ts.factory.updateFunctionDeclaration(
          node,
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...(node.modifiers ?? [])],
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters,
          node.type,
          node.body,
        );
      }
      if (ts.isVariableStatement(node)) {
        return ts.factory.updateVariableStatement(
          node,
          [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...(node.modifiers ?? [])],
          node.declarationList,
        );
      }

      if (ts.isModuleDeclaration(node)) {
        return undefined;
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

async function rewrite(fileName: fs.PathLike): Promise<ts.SourceFile> {
  const contentsBuffer = await fs.promises.readFile(fileName);
  const ast = ts.createSourceFile(
    path.basename(fileName.toString()),
    contentsBuffer.toString(),
    ts.ScriptTarget.Latest,
  );

  ast.forEachChild((node) => {
    if (ts.isClassDeclaration(node)) {
      const modifiers = [
        ...(ts.getModifiers(node)?.filter((m) => typeof m !== "undefined") ?? []),
        ts.ModifierFlags.Export,
      ] as ts.Modifier[];
      ts.factory.updateClassDeclaration(node, modifiers, undefined, undefined, undefined, []);
    }
  });

  const result = ts.transform(ast, [transformer]);

  return result.transformed[0];
}

function wrapWithModule(sourceFile: ts.SourceFile, moduleName: string): ts.SourceFile {
  const moduleParent = ts.factory.createModuleDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(moduleName),
    ts.factory.createModuleBlock(sourceFile.statements),
  );

  let moduleSource = ts.createSourceFile("_.ts", "", ts.ScriptTarget.Latest);
  moduleSource = ts.factory.updateSourceFile(
    moduleSource,
    ts.factory.createNodeArray([moduleParent]),
    false,
  );

  return moduleSource;
}

async function writeSource(sourceFile: ts.SourceFile, outFile: fs.PathLike): Promise<void> {
  const printer = ts.createPrinter();
  await fs.promises.writeFile(outFile, printer.printFile(sourceFile));
}

export async function parse(
  sourceFile: fs.PathLike,
  outFile: fs.PathLike,
  options: ParseOptions = {},
) {
  const { module: module_ = "CloudflareWorker" } = options;
  const result = await rewrite(sourceFile);

  if (typeof module_ === "string") {
    const moduleSource = wrapWithModule(result, module_);
    return await writeSource(moduleSource, outFile);
  }
  return await writeSource(result, outFile);
}
