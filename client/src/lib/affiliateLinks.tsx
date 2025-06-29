import React from "react";

// Affiliate link mappings for specific keywords
export interface AffiliateLink {
  keyword: string;
  url: string;
  displayText?: string;
}

export const affiliateLinks: AffiliateLink[] = [
  // Development Tools
  {
    keyword: "VS Code",
    url: "https://code.visualstudio.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "VS Code"
  },
  {
    keyword: "Visual Studio Code",
    url: "https://code.visualstudio.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Visual Studio Code"
  },
  {
    keyword: "GitHub",
    url: "https://github.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "GitHub"
  },
  {
    keyword: "Docker",
    url: "https://www.docker.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Docker"
  },
  {
    keyword: "MongoDB",
    url: "https://www.mongodb.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "MongoDB"
  },
  {
    keyword: "AWS",
    url: "https://aws.amazon.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "AWS"
  },
  {
    keyword: "Vercel",
    url: "https://vercel.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Vercel"
  },
  {
    keyword: "Netlify",
    url: "https://www.netlify.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Netlify"
  },
  {
    keyword: "Figma",
    url: "https://www.figma.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Figma"
  },
  {
    keyword: "Postman",
    url: "https://www.postman.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Postman"
  },
  // Learning Platforms
  {
    keyword: "Udemy",
    url: "https://www.udemy.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Udemy"
  },
  {
    keyword: "Coursera",
    url: "https://www.coursera.org/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Coursera"
  },
  {
    keyword: "Pluralsight",
    url: "https://www.pluralsight.com/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Pluralsight"
  },
  // Frameworks and Libraries
  {
    keyword: "React",
    url: "https://react.dev/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "React"
  },
  {
    keyword: "Next.js",
    url: "https://nextjs.org/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Next.js"
  },
  {
    keyword: "Node.js",
    url: "https://nodejs.org/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "Node.js"
  },
  {
    keyword: "TypeScript",
    url: "https://www.typescriptlang.org/?utm_source=devtoolhub&utm_medium=affiliate",
    displayText: "TypeScript"
  }
];

// Function to convert text with affiliate links
export function processAffiliateLinks(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remainingText = text;
  let keyIndex = 0;

  // Sort affiliate links by keyword length (longest first) to match longer phrases first
  const sortedLinks = [...affiliateLinks].sort((a, b) => b.keyword.length - a.keyword.length);

  while (remainingText.length > 0) {
    let foundMatch = false;

    // Check for affiliate link matches
    for (const link of sortedLinks) {
      const index = remainingText.toLowerCase().indexOf(link.keyword.toLowerCase());
      
      if (index !== -1) {
        // Add text before the match
        if (index > 0) {
          elements.push(remainingText.substring(0, index));
        }
        
        // Add the affiliate link
        const matchedText = remainingText.substring(index, index + link.keyword.length);
        elements.push(
          <a
            key={`affiliate-${keyIndex++}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            {link.displayText || matchedText}
          </a>
        );
        
        // Continue with remaining text
        remainingText = remainingText.substring(index + link.keyword.length);
        foundMatch = true;
        break;
      }
    }

    // If no match found, add the remaining text and break
    if (!foundMatch) {
      elements.push(remainingText);
      break;
    }
  }

  return elements;
}