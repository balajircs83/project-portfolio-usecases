import { Document, Category, DocType } from '../types';

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat_1',
        name: 'Cloud Computing',
        subcategories: [
            { id: 'sub_1_1', name: 'AWS' },
            { id: 'sub_1_2', name: 'Azure' },
            { id: 'sub_1_3', name: 'GCP' },
        ],
    },
    {
        id: 'cat_2',
        name: 'DevOps',
        subcategories: [
            { id: 'sub_2_1', name: 'CI/CD' },
            { id: 'sub_2_2', name: 'Docker' },
            { id: 'sub_2_3', name: 'Kubernetes' },
        ],
    },
    {
        id: 'cat_3',
        name: 'Artificial Intelligence',
        subcategories: [
            { id: 'sub_3_1', name: 'Machine Learning' },
            { id: 'sub_3_2', name: 'Large Language Models' },
        ],
    },
];

const sampleMarkdown = `
# Understanding React Hooks

React Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

## State Hook: \`useState\`

The most common Hook is the State Hook, \`useState\`. It lets you add React state to function components.

\`\`\`javascript
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Effect Hook: \`useEffect\`

The Effect Hook, \`useEffect\`, lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### Rules of Hooks

- Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React function components.

By following these rules, you ensure that all stateful logic in a component is clearly visible from its source code.
`;

// A simple, one-page PDF encoded in base64
const samplePDF = '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/fv68fvnz9fP3w+//9+//n3/+//7/v3///fP7+f/v9+f3/+//3/+/v33///P3++/3399/fnw+ffp+9f/v/2/f378/Pj8+/j98fPrx8fPnw/f/h8fHx/fPn7+/P32+/vx+/339+/Tx9+u3+7frt/u367fn79fvL8/fPp9+e3+7fr7++vHx/evHx+/v/w+Pn//f39/fXp/Pj1//vr68+n756/P3p8f3n//f/P/8///P3/fvn//fv39/evn58fXz5/fvL+9/fXv//f///fv9///n1+/v/w+Pnz99vP34+/n36+Pnz5/Pnz98fvnz9//vj4+Pvj4+/Px++frt+e3n39+P//+/fX5+/3v/+///3x9fvn98+vr8/e/72/f/338/vn99evnz9/Pj7+/vL75+ff3/9/v77+fvf97f7t/vft/e3748fHv+9//fn9+fP3r+9ff/++/3x+evj++e//Pz++/X18/fn97f7t++f39//PX3//+v/8+ff58/fv8+//Hx8fHz/8Pn58fP35+//r88e/z1+evz/8+ff//9+eP39///7//Pn37///ffr/9+ePHz5/+Pz1//Pr/3/+Pnz/f/v/8/eP/y+/f3z++fvz1+fnL//e/75//v/4/fv9///39/evHx8/fjx/+/P329fPr+8eP73/+Pn5//Pr99e/39+/Pnw/fHj6/fvL7/ePz5++fr9+/vr09efr//f/r79/fvj4/P3z++e/z19fHz9/f/r7+8vnz59fHj8/f/j/fvz/8PPr19ev7/fP3r++f316+/Xr89ffr+9e//3w+Pn15fPn5//PX35+/f399+eP35+/vX37//vj+9+ePHz4/vHr++Pr5/evz19f3L3/fP3/+/vn1+evX1+/P33///fHp69efr7//fjx9/vr0/evr2/f//18+P376+fX9//fPr//ffz19fvz5+/Xz5++Xz1//ff7y+fP3z+9/3z5//vLx+9f3r7/+fj5+/Pb8+fn/+8vn18/P3t/9ffv/1/ev/7//fPr1+e355/e//vj4+/3n97/f/73/+/Prx8//vz+9v7z+9/3Lx+9f/r/++f759fvLx6+fHr59/3j5+PHr89fXr98/fnr8+fHn+8vnn+///z8//n/5/fvj5+fnz+9ffrz89/3r4//vn5/e/33+9Pzx5/vPx/fP/z/+/Pjy/evH7z///35+/3v59+ffr+8vX36+fX18/fnj79cPX7+/v3x+evn8+f7n98f3vx/fPz++/7z8ev3n96/PX/+8vnn/ffz59fv3n98/vnz8fvX97fv7+8vXn++//z8+/P/j+8fP37+/P3t/efP1/evP9++f3/6+f3z7+fnj5///3/+/vjz+/vz59fHr2/f//98ff/w/e/Hz7//fH5+/33x7/P/z5/fPr5//v7w+fnr48fPjx+//j7/e/3z/evr9+/vn5+vHz7/Pnz+9v/r7++fHx+/vj58ef3/+fP/x/f3n9//vv6/fP979/vr+8/P/58///r8+f3j+8fn7++/n35/fP759/vnz++vn5+fn/+9vHr8+//v79//vn1+//n168vPr++f3z++Pj9+/vj4/fHz9+//z89/P/5+/v31/evv77+/Pr6+vnz69ef7x+/P/z+/v3x++vvz8/fX56+vnj++fr1/e/r+8vnz6+fn/++vHz8+/Pnx+/vj1//vX/+///5/fn/8///8/P/1+/vny+evz6+fnr69e/317/fvr19/Pr69fPr5/e/Px9+/337+/fnz9+/759ev/w+f3n9+/Pn58/fv7+/vX7+/Pr+/fH5+8vP/98/f/z5+//z5///r+9ffv7+9v7z9//j88+/r1/e3p7+fX73/f3n9+fvn38+/3z7+ffj59/vr8+fnn99+ff/6/f3j68vPnx9+/nj++frj8/fPn99fHj8/f/j4+Pr59+efz3/fP35/ffz++fn5+/vj5+ffz6/fHx++f//4+vPz6/Pnz+/vnz/fPr++fP9++/35+ff/5/e//35+ePz96/PH7+/ffjy+/vnr1/f3n98/f7r78/Pr/8vHz59+fn9+9f33+9vX97+/vj48fPz+8/3j/+/Pr1+evz1+//r9+fvj6+fPr++ffn1++v399ef339+Pz98/fn76/f378+/n5++fr5+/Pz69fX7w+fXz+8vn1+/v3z9/fn/++/3z4/fvj+9fn7w+fXz+9f3r7+/fj5+vH7y+//3p7/Pnz+/f/r8/f75+ffj88+vrw/fP79+/vz8/PXl8/Pj8/evny+/fnz9+/X19+fv7w8fP75/fvj58ef3z++/v35++f3388/Pn98+/Hx+/P3z4+PH568uP33/f31++/nz++/n3+///r7++/3t9+fv7w+fXz6+/Pn9+//nx5f/v9+8fPnw9+/n15fv758+vr/fP7w8fX/68fn1++fnz5/fnLz/ff738ev3w+fPj+/fn189f3n++/n3++P3z9/Pnz+/Pnz+/vn/++/v7x8/fnr8+fnj8/fvL7/e31+/Pnx+/vn59+vHx++v758+Xv/98f3n8+fr5++f7r8/fXz/ff3798vL71+/PH7++/vz88+vn9+9fPr4/P7/8f/v58+/3r+9ffnz+/vn59fP359efXx8/vnz8/fr9//PH56/fHr1+/fv/4/Pr88/v/4+fPj88fHx8+P7z/e/v18//7z6+/3j8/e/P9++fn5/fPr59fvn+9fvz5+/Xz++vn77/fP/1+/vj9//nz7+P3z9fP3z+9ffn7y/PH7/fP3z58/vj7/fPr9+/v3w8fXn6+fnw+fPz18/v77+/vn5+evz18/v3n9+/vL97ff3n5+fnz78P37x+ef3v++fPn9+/vr88fnr++frx+/v/x8f/v48+/Hx4/fv3x/ff7+///x++vzz++ePz98+f759fnr59evrx8/vHx8efz1+/v3x//vLw+fPn8+f/z58/v7y+fnr8/e/rx+//n188vn95/fHx+/P/5/P3v9+/P3w8fnry++fX58/P/5+/fn/6+efP/+8/vHx/fPn+8/Pjx8//3j+/PXn95/P3n++f/39+fP3z+8v/5+/v3r+/Pnz88ePn9++ffz4+/3388/P//+8P338//3z6+vnz99/fn5+/v/y8vPr98fXz/8eHzz//vr1+/vnx5fPH78+Pnz+efP/+8fv35/Pnz++fn5+/vH75/evz+8/v//6/fvnx+/PH77ffP74+P335/Pr89f3r+8fn/+/P/x8fP/8+fX16+//j48fH7y+vPn8+//n1/fPn9+/v39+/fr5++fnz+/vnz59fH5++/nz78fPj89ePj58+f3r+/v/z5//P358///z++/3z++f3j98/vL5+fnj5/Pnz+efX58+f3j+8/vr98fnz6+f3j9+fnr+9f/j4+f3z+fP3y+/3z4/PPrw8f3z++Pj9//vj8/eX5++fnr6+/Px9/Pj7+/fn88/vr88fX7z+/P33+8v3t+/Pz95ffLz+/f3x//vL58+f3L++Pnx8/P/z5/vnz++fr1+//n5/fPXx+//nx+/vH7y+/v7x+evnx+evn1+fP77/efv/9/fXn89e/L/9//fP739/fnz/fPn78/vn9++Pz1/f3n++P3r/fPn8++vjy/fXn95+/vz4/P3/4+f3r59ePn++f/r9+vnz5+/Xz+/f73+8fnj+8vXnx+//n1+ff75+ffj89fnr8/f/9/fvH77/f/7x+/v/9+/vz5/f/31+fv7z+/v3r+/v7r99//3z++f39//Pnx4/Pnjx8+f/79/fvj99eXz1//v/x4/vH5+/Pnx+efz7++fn78ffn/+/vr1+eff/+///5+///x+fP/w+fPn58fHr6+vP7y/efPr++/Pz5+fvL8++P758/vr5+/fHx8ffv59+fvj68fHr+//vr9+/vn++fPz8/P/z7/P/z++fr69fnr8+/nz++/nx+evH98+/v38efz6/fPz/+/Pr8/vnz68efP359e/ny9//vj++/vz++vn1+//Hx/effz4/fP35+Pnz+fnz5+/Pny//fHx++ff1+/f7z/ef318+fXz/8fX77+//j58+fr59fnr++f3v/+ff759fnz8//vj5+fPny+evz6+fnr5+fn5+/vj++f3z+/fH5+8f3r+/P3x+fv318/v71//Pr95/PX35//vz5+/Hx68vn58fnr6+vLx69fX7w+vnx8+vH7z+efz7+fHz+/fPnx5ffz9+/X19+fP36+fX968fPr++ef3z88fHjx+/fHx+//n15efP15/evLx6+fHn+8vXn/fPHjx8ffny8efz+8fPr8+fXz9//vn68/vL+8+f7z8/P/9+/fny+/Pn9+/fP77/fvL69fnr58fnz5/fn758fHz+/PXl4+fPj8+fnz++/n77+/fnr+/v/x+/v3t+ev71++vnz++f3p8/e/P3x/f//++fvz5/fPr8/f3r4/f/7w+vPr69fHr98+fnr+/vnz9ffj9/efP9++/3n8+vnz/ffj9+/fnz8/fvjy+ff3z+/PXj++fHn979fP/9++fnr5+//jy9fnzx+//r68fnj+9efz3+//n75/fvj5+//rx+evz19eP/5+/fn/6+fHx9ffHx8//v7w+fn56+fPr8/vH9++/n56+/vx++fvj5+ePr5++vn5//Pr5+vny8/v71+/fn78/f7r68vHzw+fvL8+/P33++fHzw+fXnx/ef339+Pnz59fPHz+//nz5+fv3x++fnjx+//n5/fP7z8/fnz+9fnj8//H56/vn+8/P/9+//j5+/Pz/8f3ny9fPr2/fvr+8/Pz9+//n/8+v3x8eP3x+/v75+/fnz+fP3z++/vz+9f7j+8fnjy+//nx+///x+//j8+fvHjx+/v3r+/P3/+/vL7/ePz5++fXx9/fnx+8vn1//PXx8/f75+/P3w+fP7+8fnz9+//z6+/vL+8+P77+fn/88f3389vXn/fPHz5+fP99//vny8fnz+ffP7x+/PH77ff/5+/vHx9+fHx6/Pny9+fPr98eP//8/vL5/efr94+fnz9+fv7y/fvHx+/f339ef/r88fnr5++fny+/v31//f7r6+vLx+/vDx/fP/98/vnw+ff1++ef3/8+fPjx+//j+8vn9+//n1+fnr59ev7r89f33+8v/z+/fPz+9fPr++f//68vXj89f/j8//Pr9+ffr4+/Pnz+/f/r5+f3jx8f3z8+f3j+ffz8/f/94+fnr++ef3j+/PX/6/P3j+8/vr98//Hx9/vH95/fHx+//n9/fvr5++vn9++Pz1/ef3t+/fHx6+fny8/vn+8fnr5//Pr+8f/j8+fvr5/fvj8/ffjx8/vX54+f7z8+fr5++vHx8f/7y8/vr5+fvj18/P7x8/vH95/P33+9vX9+/Pnx++v77++vjy+//n8/fPrx8e/3j8+fnz98fH77+fPr6+fn/++f/z18+f//58vnj5/fnz5+//z19fvn958/v398fvn5+f3z5+//nx/fvn+9fvjx+//v74+fn9++/nr8/vH97/fn/++vnz8fvn5+efz5+//z8/v/7+/fn1++Pzz6+/H5/fPn968/vj98/vnz68vP/+8fvjx+/vnj95//33+9/f3r+8fH95/fHx+/vn99+fnz+/v75/evz19fHz98fnr6+vj1+ef33/e/P96/vP7w8/vn96//3r+/PX5++/396//P/9+fnz+ef3z++v7z4/e3358/vr5+vn59fvr+9efXj+/f339+//7r8+/nx9+v/x+/v35//v7y8vHx4+fPj1+/vny9fvnz+vPr8/fn/+///r88fPnx+//r89ef3r8+f//8/fPr+8fnj+8vn5+fn/++vHz8+/Pnx+/vjx+//nx++fnz8ffn++//nz8//nz58vPr8+fvnx8fPnz6//P358vPnx+/vny8/vn1+fnz++P31/fnz+9fnr8/fPn++f3j88fnz6+f3r+/Pnz++vn5+/vnz+evLz++Pnx9/PHz++PHjx+/fH5+//ny/fvHx+/f315/P3z9/fn5+/vjw9f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';

export const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'doc_1',
        title: 'Introduction to React Hooks',
        type: DocType.Markdown,
        content: sampleMarkdown,
        categoryId: 'cat_2',
        subcategoryId: 'sub_2_1',
        tags: ['react', 'frontend', 'javascript'],
        summary: 'A brief overview of React Hooks, including useState and useEffect, with code examples.',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
        id: 'doc_2',
        title: 'Architecting on AWS',
        type: DocType.PDF,
        content: samplePDF,
        categoryId: 'cat_1',
        subcategoryId: 'sub_1_1',
        tags: ['aws', 'cloud', 'architecture'],
        summary: 'Official AWS guide on building robust and scalable cloud solutions.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    },
    {
        id: 'doc_3',
        title: 'Getting Started with Kubernetes',
        type: DocType.Markdown,
        content: '# Kubernetes Basics\n\nThis is a placeholder for a Kubernetes document.',
        categoryId: 'cat_2',
        subcategoryId: 'sub_2_3',
        tags: ['kubernetes', 'orchestration', 'containers'],
        summary: 'A beginner-friendly guide to understanding Kubernetes concepts.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    },
    {
        id: 'doc_4',
        title: 'LLM Fundamentals',
        type: DocType.Markdown,
        content: '# Large Language Models\n\nExploring the fundamentals of LLMs.',
        categoryId: 'cat_3',
        subcategoryId: 'sub_3_2',
        tags: ['ai', 'llm', 'nlp'],
        summary: 'An exploration of the core principles behind Large Language Models.',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    },
];