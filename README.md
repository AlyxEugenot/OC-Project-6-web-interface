# OC-Project-6-web-interface

Open Classroom's Python course [6th project](https://openclassrooms.com/paths/518/projects/835/415-scenario) about creating a "streaming website" interface to an external API made by Open Classroom.

The design is supposed to match [this maquette on figma](https://www.figma.com/design/6KzVM5R2pOBX637RcVWjJ7/Maquettes-JustStreamIt).

The only framework used to create the interface is [bootstrap 5.3.8](https://getbootstrap.com/docs/5.3/getting-started/introduction/) and HTML5 and ES6 Javasript integrated tools like fetch.

### The website only works after having the OCMovies REST API server running by [following its repository instructions](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR).

### The REST API server should be running on localhost:8000 as per default.

---

Once the API is running, a local web server has to be hosted through your prefered choice.

Some of these choices are:

- Visual Studio Live Server (bottom right of interface)
- Node.js' [`http-server`](https://www.npmjs.com/package/http-server)
- Python's [`http.server` module](https://docs.python.org/3/library/http.server.html)

Get to the cloned/imported project's directory in a console through `cd` command and use either:

```
npx http-server . -o
```

```
python3 -m http-server
```

---

> [!NOTE] Note
> <br />
> A lot of image links have been shut down by Amazon since Open Classroom created the API and as a result, a lot of related console errors show up.
> <br />
> I purposefully let them as is as this is an issue I would report to the back end client.

### Now enjoy this stellar work.
