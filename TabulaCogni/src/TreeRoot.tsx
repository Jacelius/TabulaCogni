import { useMemo } from 'react';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import { LinkHorizontal } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';

const peach = '#fd9b93';
const pink = '#fe6e9e';
const blue = '#03c0dc';
const green = '#26deb0';
const plum = '#71248e';
const lightpurple = '#374469';
const white = '#ffffff';
export const background = '#272b4d';

interface TreeNode {
  name: string;
  children?: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

const rawTree: TreeNode = {
  name: 'Humanity',
  children: [
    {
        name: 'A',
        children: [{ name: 'A1' }, { name: 'A2' }],
    }
  ],
};

function RootNode({ node }: { node: HierarchyNode }) {
  return (
    <Group top={node.x} left={node.y}>
      <circle r={20} fill="url('#lg')" />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={plum}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function ParentNode({ node }: { node: HierarchyNode }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={blue}
        strokeWidth={1}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={white}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

/** Handles rendering Root, Parent, and other Nodes. */
function Node({ node }: { node: HierarchyNode }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;
  if (isParent) return <ParentNode node={node} />;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={green}
        strokeWidth={1}
        strokeDasharray="2,2"
        strokeOpacity={0.6}
        rx={10}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        fill={green}
        style={{ pointerEvents: 'none' }}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 10, left: 80, right: 80, bottom: 10 };

export type TreeProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function TreeRoot({ width, height, margin = defaultMargin }: TreeProps) {
    const data = useMemo(() => hierarchy(rawTree), []);
    
    return width < 10 ? null : (
        <svg width={width} height={height}>
        <LinearGradient id="lg" from={peach} to={pink} />
        <rect width={width} height={height} rx={14} fill="url('#lg')" />
        <Tree<TreeNode> root={data} size={[height, width]}>
            {tree => (
            <Group top={margin.top} left={margin.left}>
                {tree.links().map((link, i) => (
                <LinkHorizontal
                    key={i}
                    data={link}
                    stroke={lightpurple}
                    strokeWidth="1"
                    fill="none"
                />
                ))}
                {tree.descendants().map((node, i) => (
                <Node key={i} node={node} />
                ))}
            </Group>
            )}
        </Tree>
        </svg>
    );
    }
