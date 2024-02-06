module.exports = function (options) {
  return (
`{
  "guid": "${options.guid}",
  "name": "${options.name}",
  "icon": "${options.icon}",
  "description": "${options.description}"
}`);
}
