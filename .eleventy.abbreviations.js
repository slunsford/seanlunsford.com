module.exports = function(md) {
    // Acronym plugin
    md.core.ruler.after('inline', 'acronyms', function(state) {
        for (let i = 0; i < state.tokens.length; i++) {
            if (state.tokens[i].type === 'inline' && state.tokens[i].children) {
                let tokens = state.tokens[i].children;
                let newTokens = [];
                
                for (let j = 0; j < tokens.length; j++) {
                    let token = tokens[j];
                    if (token.type === 'text') {
                        let text = token.content;
                        let lastIndex = 0;
                        let match;
                        let regex = /\b([A-Z]{2,}s?)\b/g;
                        
                        while ((match = regex.exec(text)) !== null) {
                            // Add text before match
                            if (match.index > lastIndex) {
                                let textToken = new state.Token('text', '', 0);
                                textToken.content = text.slice(lastIndex, match.index);
                                newTokens.push(textToken);
                            }
                            
                            // Add opening abbr
                            let openToken = new state.Token('html_inline', '', 0);
                            openToken.content = '<abbr>';
                            newTokens.push(openToken);
                            
                            // Add acronym text
                            let acronymToken = new state.Token('text', '', 0);
                            acronymToken.content = match[1];
                            newTokens.push(acronymToken);
                            
                            // Add closing abbr
                            let closeToken = new state.Token('html_inline', '', 0);
                            closeToken.content = '</abbr>';
                            newTokens.push(closeToken);
                            
                            lastIndex = regex.lastIndex;
                        }
                        
                        // Add remaining text
                        if (lastIndex < text.length) {
                            let textToken = new state.Token('text', '', 0);
                            textToken.content = text.slice(lastIndex);
                            newTokens.push(textToken);
                        }
                        
                        // If no matches found, keep original token
                        if (newTokens.length === 0) {
                            newTokens.push(token);
                        }
                    } else {
                        newTokens.push(token);
                    }
                }
                
                state.tokens[i].children = newTokens;
            }
        }
    });
};