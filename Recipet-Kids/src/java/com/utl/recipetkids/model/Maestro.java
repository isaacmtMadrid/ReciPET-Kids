package com.utl.recipetkids.model;

public class Maestro {

    private int idMaestro;
    private String nombre;
    private String apellidoPat;
    private String apellidoMat;
    private String fechaNac;
    private String genero;
    private String telefono;
    private String email;
    private String fechaAlta;
    private int estatus;

    public Maestro() {}

    public int getIdMaestro() { return idMaestro; }
    public void setIdMaestro(int idMaestro) { this.idMaestro = idMaestro; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidoPat() { return apellidoPat; }
    public void setApellidoPat(String apellidoPat) { this.apellidoPat = apellidoPat; }

    public String getApellidoMat() { return apellidoMat; }
    public void setApellidoMat(String apellidoMat) { this.apellidoMat = apellidoMat; }

    public String getFechaNac() { return fechaNac; }
    public void setFechaNac(String fechaNac) { this.fechaNac = fechaNac; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(String fechaAlta) { this.fechaAlta = fechaAlta; }

    public int getEstatus() { return estatus; }
    public void setEstatus(int estatus) { this.estatus = estatus; }
}