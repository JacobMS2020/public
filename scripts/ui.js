// ui.js: UI-specific logic

// Display tooltips on hover
document.querySelectorAll('.menu-obj').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerText = getTooltipText(icon);
        document.body.appendChild(tooltip);
        tooltip.style.left = `${(icon.getBoundingClientRect().left)}px`;
        tooltip.style.top = `${icon.getBoundingClientRect().bottom + 5}px`;
    });

    icon.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

const powerline_ui = document.getElementById('powerline-obj');
powerline_ui.addEventListener('mouseenter', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = 'Powerline';
    document.body.appendChild(tooltip);
    
    // Position the tooltip relative to the powerline element
    tooltip.style.left = `${powerline_ui.getBoundingClientRect().left + 5}px`;
    tooltip.style.top = `${powerline_ui.getBoundingClientRect().bottom - 10}px`;
});

powerline_ui.addEventListener('mouseleave', () => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
});

const contract_menu = document.getElementById('contract-menu');
contract_menu.addEventListener('mouseenter', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = 'Contracts';
    document.body.appendChild(tooltip);
    
    // Position the tooltip relative to the powerline element
    tooltip.style.left = `${contract_menu.getBoundingClientRect().left}px`;
    tooltip.style.top = `${contract_menu.getBoundingClientRect().bottom}px`;
});

contract_menu.addEventListener('mouseleave', () => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
});

// Get tooltip text based on the icon
function getTooltipText(icon) {
    if (icon.src.includes('checkpoint')) return 'Checkpoint.';
    if (icon.src.includes('datacenter')) return 'Data Center.';
    if (icon.src.includes('firewall')) return 'Firewall.';
    if (icon.src.includes('router')) return 'Router.';
    if (icon.src.includes('server')) return 'Server.';
    if (icon.src.includes('generator')) return 'Generator.';
    return 'Unknown item';
}

// Additional UI-related code can go here
