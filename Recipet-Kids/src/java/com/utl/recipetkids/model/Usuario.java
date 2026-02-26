package com.utl.recipetkids.model;

public class Usuario
{
    int     idUsuario;
    String  nombreUsuario;
    String  contrasenia;
    String  rol;
    Maestro maestro;

    public Usuario() {}

    public Usuario(int idUsuario, String nombreUsuario,
                   String contrasenia, String rol, Maestro maestro)
    {
        this.idUsuario    = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.contrasenia  = contrasenia;
        this.rol          = rol;
        this.maestro      = maestro;
    }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getContrasenia() { return contrasenia; }
    public void setContrasenia(String contrasenia) { this.contrasenia = contrasenia; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Maestro getMaestro() { return maestro; }
    public void setMaestro(Maestro maestro) { this.maestro = maestro; }
}